import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AbsenceModalProps {
  isOpen: boolean;
  date: string | null;
  userName: string;
  onSubmit: (justification: string) => void;
}

export function AbsenceModal({ isOpen, date, userName, onSubmit }: AbsenceModalProps) {
  const [justification, setJustification] = useState('');

  const handleSubmit = () => {
    if (justification.trim()) {
      onSubmit(justification);
      setJustification('');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Justificativa de Ausência
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {userName}, você não registrou expediente em {date && formatDate(date)}. 
            Justifique sua ausência abaixo.
          </p>
          
          <Textarea
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Digite sua justificativa..."
            className="min-h-[100px]"
            autoFocus
          />
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit}
              disabled={!justification.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              Enviar Justificativa
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
