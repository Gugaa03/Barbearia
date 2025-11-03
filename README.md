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

<img width="2513" height="1248" alt="image" src="https://github.com/user-attachments/assets/77f0ae45-357e-4834-804c-6ea8b7526d17" />
<img width="2511" height="1006" alt="image" src="https://github.com/user-attachments/assets/dbf6df5f-aa2d-4008-a883-fed8c3cf433e" />
<img width="2439" height="1186" alt="image" src="https://github.com/user-attachments/assets/2bd934bc-23c3-4e73-9948-0bf7d84150be" />
<img width="1867" height="899" alt="image" src="https://github.com/user-attachments/assets/3acd406f-1c6d-4a97-968d-64cdf9cf1aaf" />


