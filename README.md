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
* Melhorar parte Visual e funcionalidades: ⚠️ **Em andamento**
* Teste e Deploy final: ⚠️ **Pendente**

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
<img width="1870" height="633" alt="image" src="https://github.com/user-attachments/assets/17aa0006-af23-4b75-9058-edfd8ac27a43" />
<img width="1848" height="836" alt="image" src="https://github.com/user-attachments/assets/e64f651d-76ec-4398-bf17-cbb029ad949b" />
<img width="1308" height="708" alt="image" src="https://github.com/user-attachments/assets/3aba83f8-9d1e-4719-ba47-b9e2d5c90392" />


