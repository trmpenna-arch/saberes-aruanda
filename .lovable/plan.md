## Implementação da Área de Cursos Pagos

Vou criar uma área dedicada para cursos pagos, incluindo a estrutura de banco de dados, a interface de listagem e os detalhes dos cursos com lições.

### Estrutura Técnica:
1.  **Banco de Dados**: Já criei as tabelas `courses`, `course_lessons` e `course_purchases` com RLS para proteger o conteúdo pago.
2.  **Novas Rotas**:
    *   `/cursos`: Listagem de todos os cursos disponíveis.
    *   `/cursos/$slug`: Detalhes do curso, grade de aulas e botão de compra.
    *   `/cursos/$slug/aula/$lessonSlug`: Área de visualização da aula (protegida para compradores).
3.  **Componentes**:
    *   `CourseCard`: Para exibir cursos na listagem.
    *   `LessonList`: Para mostrar as aulas de um curso.
4.  **Pagamentos**: Vou preparar a interface para integração futura com pagamentos (atualmente simulada ou via link externo até a ativação do Paddle/Stripe).

### Detalhes Técnicos:
*   Uso de `tanstack/react-router` para as novas rotas.
*   Integração com Supabase para buscar cursos e verificar permissões de acesso.
*   Uso de componentes do Shadcn UI para uma interface moderna e espiritualizada.
