# Barbearia Estilo – Sistema de Gestão

> Projeto de gerenciamento de uma barbearia com registro de barbeiros, clientes e histórico de marcações.
> Status: **Quase finalizado** 🚀

## Descrição

Este projeto é um sistema completo para gerenciamento de uma barbearia, permitindo:

* Registro de barbeiros e clientes.
* Gestão de agendamentos e histórico de marcações.
* Dashboard para barbeiros acompanharem suas marcações.
* Integração com Supabase para autenticação e banco de dados.
* Upload de fotos de barbeiros via arquivo local.

O sistema ainda está em desenvolvimento, mas a maior parte das funcionalidades já está implementada.

---

## Funcionalidades

### Usuário / Cliente

* Criar conta e login.
* Visualizar histórico de agendamentos.
* Acessar portfólio de serviços.

### Barbeiro / Admin

* Registrar novos barbeiros.
* Acompanhar agenda diária e completa.
* Visualizar histórico de marcações por dia ou total.
* Editar perfil e gerenciar suas marcações.

---

## Tecnologias

* **Frontend:** Next.js, React, TailwindCSS.
* **Backend:** Supabase (autenticação, banco de dados, storage).
* **UI Components:** `@/components/ui` (Card, Button, etc).
* **Autenticação:** Supabase Auth.

---

## Estrutura do Projeto

```
/components      # Componentes reutilizáveis (Navbar, Card, Buttons)
/lib             # Configuração do Supabase
/pages           # Páginas principais (login, signup, dashboard, histórico)
/public          # Assets públicos (imagens, ícones)
/styles          # Estilos globais
```

---

## Como Rodar

1. Clone o repositório:

```bash
git clone <[url-do-repositorio](https://github.com/Gugaa03/Barbearia/)>
cd Barbearia
```

2. Instale as dependências:

```bash
npm install
```



4. Rode o projeto:

```bash
npm run dev
```

5. Acesse em: `http://localhost:3000`

---

## Status do Projeto

* Cadastro de clientes: ✅
* Cadastro de barbeiros: ✅
* Dashboard do barbeiro: ✅
* Histórico de marcações: ✅
* Upload de fotos de barbeiro: ✅
* Melhorar parte Visual e testes: ⚠️ **Em andamento**
* Deploy final: ⚠️ **Pendente**

> O sistema está **quase completo** e pronto para testes internos.
> Funcionalidades principais estão implementadas, restam apenas ajustes finais e refinamento visual.

---

## Próximos Passos

* Melhorar experiência do usuário no dashboard.
* Adicionar notificações de marcação.
* Refinar responsividade em dispositivos móveis.
* Testes finais e deploy em produção.
Prints do Projeto

## Espaço reservado para algumas capturas de tela das funcionalidades implementadas.

<img width="1876" height="828" alt="image" src="https://github.com/user-attachments/assets/983af4f7-1a06-41c0-bf19-0c67e1c0b4d9" />
<img width="1866" height="458" alt="image" src="https://github.com/user-attachments/assets/c2a7dfce-18d3-4f74-be5b-f7cf4c62cf07" />
<img width="1816" height="815" alt="image" src="https://github.com/user-attachments/assets/7f6bcb71-19b4-4572-a3ca-f217687594c0" />
<img width="1457" height="763" alt="image" src="https://github.com/user-attachments/assets/1c02c9bf-79d4-44f0-89c4-ec9d3abc99e6" />


