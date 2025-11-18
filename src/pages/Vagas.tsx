import { useState, useEffect } from 'react';
import { QueueRow } from '@/models/QueueRow';
import { Button } from 'primereact/button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { AddPlayerDialog } from '@/components/AddPlayerDialog';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useQueueService } from '@/services/QueueService';

export default function Vagas() {
  const { getPlayersQueue, addPlayerToQueue, removePlayerFromQueue, onPlayerQueueChanges } = useQueueService();
  const [queue, setQueue] = useState<QueueRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const loadQueue = async () => {
    setLoading(true);
    try {
      const data = await getPlayersQueue();
      const sortedData = data.sort((a, b) => a.queueTime.getTime() - b.queueTime.getTime());
      setQueue(sortedData);
    } catch (error) {
      console.error('Erro ao carregar fila:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar a fila',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToQueueChanges = async () => {
    await onPlayerQueueChanges(loadQueue);
  };

  useEffect(() => {
    loadQueue();
    subscribeToQueueChanges()
  }, []);

  const handleRemove = (userName: string) => {
    setSelectedPlayer(userName);
    setShowConfirmDialog(true);
  };

  const confirmRemove = async () => {
    if (!selectedPlayer) return;
    
    try {
      await removePlayerFromQueue(selectedPlayer);
      await loadQueue();
      toast({
        title: 'Sucesso',
        description: `${selectedPlayer} foi removido da fila`,
      });
    } catch (error) {
      console.error('Erro ao remover jogador:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o jogador',
        variant: 'destructive',
      });
    } finally {
      setSelectedPlayer(null);
    }
  };

  const handleAdd = async (userName: string) => {
    try {
      await addPlayerToQueue(userName);
      await loadQueue();
      toast({
        title: 'Sucesso',
        description: `${userName} foi adicionado à fila`,
      });
    } catch (error) {
      console.error('Erro ao adicionar jogador:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o jogador',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col h-full p-8 gap-6 bg-background">
      <div className="flex items-center justify-between gap-4 mb-2">
        <h1 className="text-4xl font-bold text-foreground">Fila de Players (!vaga)</h1>
        <div className="flex items-center gap-4">
          <Button
            label="Adicionar Jogador"
            icon="pi pi-plus"
            onClick={() => setShowAddDialog(true)}
            className="px-6 py-3 font-bold shadow-lg hover:shadow-xl transition-all"
            style={{
              backgroundColor: 'hsl(var(--accent))',
              color: 'hsl(var(--accent-foreground))',
              border: 'none'
            }}
          />
          <Button
            icon="pi pi-refresh"
            rounded
            outlined
            onClick={loadQueue}
            loading={loading}
            className="px-4 py-3 font-bold shadow-lg hover:shadow-xl transition-all"
            style={{
              borderColor: 'hsl(var(--muted))',
              color: 'hsl(var(--sidebar-accent))',
              border: '1px solid'
            }}
          />
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-md border border-border overflow-hidden">
        {queue.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <i className="pi pi-users text-5xl mb-4 opacity-50" />
              <p className="text-xl">Nenhum jogador na fila</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {queue.map((player, index) => (
              <div
                key={`${player.userName}-${index}`}
                className={`flex items-center justify-between p-6 transition-all ${
                  index === 0
                    ? 'bg-gradient-to-r from-accent/20 to-transparent border-t-2 border-accent shadow-lg'
                    : 'hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-6 flex-1">
                  <div className={`text-2xl font-bold ${
                    index === 0 ? 'text-accent' : 'text-muted-foreground'
                  } w-12 text-center`}>
                    {index + 1}°
                  </div>
                  
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-semibold text-foreground">
                        {player.userName}
                      </span>
                      {index === 0 && (
                        <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full shadow-md">
                          PRÓXIMO
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Entrou às {format(player.queueTime, 'HH:mm')}
                    </span>
                  </div>
                </div>

                <Button
                  icon="pi pi-trash"
                  rounded
                  outlined
                  severity="danger"
                  onClick={() => handleRemove(player.userName)}
                  className="hover:bg-destructive/10"
                  tooltip="Remover da fila"
                  tooltipOptions={{ position: 'left' }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        visible={showConfirmDialog}
        onHide={() => {
          setShowConfirmDialog(false);
          setSelectedPlayer(null);
        }}
        onConfirm={confirmRemove}
        header="Remover jogador"
        message={`Deseja remover ${selectedPlayer} da fila?`}
      />

      <AddPlayerDialog
        visible={showAddDialog}
        onHide={() => setShowAddDialog(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}
