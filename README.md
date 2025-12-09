# 🎓 Plataforma Educação com Evidências (EcE)

> *"Transformamos dados e boas evidências em acolhimento e ações reais."*

A **Plataforma EcE** é uma iniciativa dedicada a conectar a ciência educacional com a prática de sala de aula. Nossa missão é democratizar o acesso a evidências científicas de qualidade, oferecendo ferramentas intuitivas para professores, gestores e famílias.

---

## 🚀 Funcionalidades

### 🏛️ Institucional & Metodologia
- **Apresentação Impactante:** Uma interface moderna e acolhedora que apresenta a missão e os valores da EcE.
- **Quem Somos:** Conheça as mentes por trás do projeto, com perfis interativos dos fundadores.
- **Metodologia Visual:** Explicação clara dos pilares da "Ciência do Afeto" e "Educação com Evidências".

### 🔬 EcE Lab (Laboratório de Evidências)
O coração da plataforma. Um explorador de dados robusto e amigável:
- **Busca Inteligente:** Pesquise por termos, títulos ou ações práticas.
- **Filtros Dinâmicos:** Refine sua busca por critérios de qualidade:
  - 🎯 **Certeza de Causa** (Validade Interna)
  - 📊 **Precisão dos Dados** (Confiabilidade)
  - 🌍 **Potencial de Escala** (Validade Externa)
- **Badges Visuais:** Identificação rápida da qualidade das evidências com sistema de cores semafórico.
- **Ferramentas de Exportação:**
  - 📄 Gerador de Relatórios em HTML (para impressão ou compartilhamento).
  - 💾 Exportação de dados brutos em CSV.
- **Detalhes Profundos:** Modais informativos com diagnósticos metodológicos e recomendações práticas.

### 🚧 Recursos Digitais (Monitor)
- Área dedicada a ferramentas de gestão e visualização de dados territoriais (Em construção).

---

## 🛠️ Tecnologias Utilizadas

Construído com uma stack moderna focada em performance e experiência do usuário (UX):

- **[Next.js 14](https://nextjs.org/)** (App Router): Framework React para produção, garantindo renderização rápida (Server Components).
- **[TypeScript](https://www.typescriptlang.org/)**: Tipagem estática para um código mais seguro e robusto.
- **[Tailwind CSS](https://tailwindcss.com/)**: Estilização utilitária para um design sistema consistente e responsivo.
- **[Supabase](https://supabase.com/)**: Backend as a Service (PostgreSQL) para armazenamento seguro e escalável das evidências.
- **[Lucide React](https://lucide.dev/)**: Ícones elegantes e leves.

---

## 📂 Estrutura do Projeto

```bash
├── app/                  # Rotas e Páginas (App Router)
│   ├── lab/              # Página do Laboratório (Fetch no Server)
│   └── page.tsx          # Landing Page
├── components/           # Componentes Reutilizáveis (UI)
│   ├── EvidenceDetailModal.tsx  # Modal de detalhes da evidência
│   ├── Hero.tsx          # Seção principal
│   ├── About.tsx         # Seção Quem Somos
│   └── ...
├── utils/                # Utilitários e Configuração do Supabase
└── public/               # Assets estáticos (Imagens, Logos)
```

## 👣 Próximos Passos & Roadmap

- [ ] Integração completa do Dashboard de Monitoramento (Shiny/Streamlit).
- [ ] Área de login para gestores e parceiros.
- [ ] Blog integrado para artigos de profundidade.

---

## 👥 Autores

| [<img src="public/will.jpg" width="100px;" alt=""/><br /><sub><b>William Melo</b></sub>](https://www.linkedin.com/in/williamcorreademelo/)<br />🚀 Fundador & Educador | [<img src="public/isabel.png" width="100px;" alt=""/><br /><sub><b>Isabel Costa</b></sub>](https://www.linkedin.com/in/isabel-c-aa9117a7/)<br />💼 Gestão Administrativa |
| :---: | :---: |

---

<div align="center">
  <p>Feito com ❤️ e Ciência.</p>
</div>
