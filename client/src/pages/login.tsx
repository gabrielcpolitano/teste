import React, { useState } from 'react';
import { Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface LoginProps {
  onLogin: (name: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [name, setName] = useState('Gabriel');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Company Logo/Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-primary rounded-full flex items-center justify-center mb-4">
            <Code className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">TechFoco Inc.</h1>
          <p className="text-muted-foreground mt-2">Sistema de Ponto - Desenvolvedor</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-center">Acesso ao Sistema</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employeeName">Nome do Funcionário</Label>
                <Input
                  id="employeeName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">
                <Code className="mr-2 h-4 w-4" />
                Entrar no Sistema
              </Button>
            </form>
            
            <div className="text-center text-sm text-muted-foreground mt-6 space-y-1">
              <p>Bem-vindo de volta, {name}.</p>
              <p>Pronto para mais um dia na TechFoco Inc.?</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
