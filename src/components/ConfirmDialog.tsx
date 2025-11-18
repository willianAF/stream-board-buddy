import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

interface ConfirmDialogProps {
  visible: boolean;
  onHide: () => void;
  onConfirm: () => void;
  message?: string;
  header?: string;
}

export function ConfirmDialog({
  visible,
  onHide,
  onConfirm,
  message = 'Tem certeza que deseja excluir esta mensagem?',
  header = 'Confirmar exclusão'
}: ConfirmDialogProps) {
  const footer = (
    <div className="flex gap-2 justify-end">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={onHide}
        className="p-button-text"
      />
      <Button
        label="Confirmar"
        icon="pi pi-check"
        onClick={() => {
          onConfirm();
          onHide();
        }}
        severity="danger"
      />
    </div>
  );

  return (
    <Dialog
      header={header}
      visible={visible}
      style={{ width: '400px' }}
      onHide={onHide}
      footer={footer}
      modal
    >
      <div className="flex items-center gap-3">
        <i className="pi pi-exclamation-triangle text-destructive text-2xl" />
        <span className="text-foreground">{message}</span>
      </div>
    </Dialog>
  );
}
