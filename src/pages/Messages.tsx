import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { MessageDialog } from '@/components/MessageDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/models/Message';
import React from 'react';
import { CreateMessage } from '@/models/CreateMessage';
import { UpdateMessage } from '@/models/UpdateMessage';
import { useMessageService } from '@/services/MessageService';

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const { getMessages, createMessage, updateMessage, deleteMessage } = useMessageService();
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao carregar mensagens',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setEditingMessage(null);
    setDialogVisible(true);
  };

  const handleEdit = (message: Message) => {
    setEditingMessage(message);
    setDialogVisible(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setConfirmVisible(true);
  };

  const handleSave = async (message: CreateMessage | UpdateMessage) => {
    try {
      if (editingMessage) {
        await updateMessage(message as UpdateMessage);
        toast({
          title: 'Sucesso',
          description: 'Mensagem atualizada com sucesso'
        });
      } else {
        await createMessage(message);
        toast({
          title: 'Sucesso',
          description: 'Mensagem criada com sucesso'
        });
      }
      await loadMessages();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao salvar mensagem',
        variant: 'destructive'
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    
    try {
      await deleteMessage(deletingId);
      toast({
        title: 'Sucesso',
        description: 'Mensagem excluída com sucesso'
      });
      await loadMessages();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao excluir mensagem',
        variant: 'destructive'
      });
    } finally {
      setDeletingId(null);
    }
  };

  const optionsBodyTemplate = (message: Message) => {
    return (
      <React.Fragment>
        <div className="flex justify-center items-center gap-4">
          <Button icon="pi pi-pencil" rounded outlined onClick={() => handleEdit(message)} />
          <Button icon="pi pi-trash" rounded outlined onClick={() => handleDelete(message.id)} />
        </div>
      </React.Fragment>
    );
  };

  const statusBodyTemplate = (message: Message) => {
    return message.active ? (
      <i className="pi pi-check px-4" style={{ color: 'green', fontSize: '1.5rem' }}></i>
    ) : (
      <i className="pi pi-times px-4" style={{ color: 'red', fontSize: '1.5rem' }}></i>
    );
  }

  return (
    <div className="flex flex-col h-full p-8 gap-6 bg-background">
      <div className="flex items-center justify-between gap-4 mb-2">
        <h1 className="text-4xl font-bold text-foreground">Mensagens</h1>
        <div className="flex items-center gap-4">
          <Button
            label="Nova Mensagem"
            icon="pi pi-plus"
            onClick={handleNew}
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
            onClick={loadMessages}
            className="px-4 py-3 font-bold shadow-lg hover:shadow-xl transition-all"
            style={{
              borderColor: 'hsla(var(--muted) )',
              color: 'hsl(var(--sidebar-accent))',
              border: '1px solid'
            }}  
          />
        </div>
      </div>

      <div className="h-[45rem] bg-card rounded-2xl shadow-md border border-border overflow-hidden">
        <DataTable
          value={messages}
          loading={loading}
          paginator
          rows={6}
          emptyMessage="Nenhuma mensagem encontrada"
          className="p-datatable-striped"
          stripedRows
          rowHover
          responsiveLayout="scroll"
        >
          <Column 
            header="Status" 
            align='center'
            body={statusBodyTemplate}
            headerStyle={{ backgroundColor: 'hsl(var(--muted))', fontWeight: '600', fontSize: '0.95rem' }}
          />
          <Column 
            field="text" 
            header="Mensagem" 
            style={{ width: '83%', fontSize: '1rem', padding: '1.25rem' }}
            headerStyle={{ backgroundColor: 'hsl(var(--muted))', fontWeight: '600', fontSize: '0.95rem' }}
          />
          <Column
            body={optionsBodyTemplate}
            header="Opções"
            exportable={false}
            align='center'
            style={{ width: '10%', padding: '1.25rem' }}
            headerStyle={{ backgroundColor: 'hsl(var(--muted))', fontWeight: '600', fontSize: '0.95rem' }}
          />
        </DataTable>
      </div>

      <MessageDialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        onSave={handleSave}
        message={editingMessage}
        title={editingMessage ? 'Editar Mensagem' : 'Nova Mensagem'}
      />

      <ConfirmDialog
        visible={confirmVisible}
        onHide={() => setConfirmVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
