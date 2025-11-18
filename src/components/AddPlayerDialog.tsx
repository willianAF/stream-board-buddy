import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

interface AddPlayerDialogProps {
  visible: boolean;
  onHide: () => void;
  onAdd: (userName: string) => void;
}

export function AddPlayerDialog({ visible, onHide, onAdd }: AddPlayerDialogProps) {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (visible) {
      setUserName('');
    }
  }, [visible]);

  const handleAdd = () => {
    if (userName.trim()) {
      onAdd(userName.trim());
      setUserName('');
      onHide();
    }
  };

  const footer = (
    <div className="flex gap-2 justify-end">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={onHide}
        className="p-button-text"
      />
      <Button
        label="Adicionar"
        icon="pi pi-check"
        onClick={handleAdd}
        disabled={!userName.trim()}
      />
    </div>
  );

  return (
    <Dialog
      header="Adicionar Jogador"
      visible={visible}
      style={{ width: '400px' }}
      onHide={onHide}
      footer={footer}
      modal
    >
      <div className="flex flex-col gap-4">
        <label htmlFor="player-name" className="font-medium text-foreground">
          Nome do Viewer
        </label>
        <InputText
          id="player-name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Digite o nome do jogador..."
          className="w-full"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
      </div>
    </Dialog>
  );
}
