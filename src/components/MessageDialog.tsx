import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import type { UpdateMessage } from '@/models/UpdateMessage';
import type { CreateMessage } from '@/models/CreateMessage';

interface MessageDialogProps {
  visible: boolean;
  onHide: () => void;
  onSave: (message: UpdateMessage | CreateMessage) => void;
  message: UpdateMessage
  title: string;
}

export function MessageDialog({ visible, onHide, onSave, message, title }: MessageDialogProps) {
  const [text, setText] = useState('');
  const [checked, setChecked] = useState(true);

  useEffect(() => {
    setText(message?.text || '');
    setChecked(message?.active ?? true);
  }, [visible, message]);

  const handleSave = () => {
    if (text.trim()) {
      onSave({ id: message?.id, text, active: checked });
      setText('');
      setChecked(true);
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
        label="Salvar"
        icon="pi pi-check"
        onClick={handleSave}
        disabled={!text.trim()}
      />
    </div>
  );

  return (
    <Dialog
      header={title}
      visible={visible}
      style={{ width: '500px' }}
      onHide={onHide}
      footer={footer}
      modal
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <label className="font-medium text-foreground" htmlFor="">
            Ativo
          </label>
          <InputSwitch checked={checked} onChange={(e) => setChecked(e.value)} />
        </div>
        <div className="flex flex-col gap-4">
          <label htmlFor="message-text" className="font-medium text-foreground">
            Mensagem
          </label>
          <InputTextarea
            id="message-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="w-full"
            placeholder="Digite a mensagem..."
          />
        </div>
      </div>
    </Dialog>
  );
}
