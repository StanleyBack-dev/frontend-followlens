import type { Metadata } from "next";
import { LegalLayout } from "@/features/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Termos de Uso",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalLayout title="Termos de Uso" updatedAt="3 de outubro de 2026">
      <p>
        Ao criar uma conta e usar o FollowLens (&ldquo;Serviço&rdquo;), você
        concorda com estes Termos. Se não concordar, não use o Serviço.
      </p>

      <h2>1. O que o FollowLens faz</h2>
      <p>
        O FollowLens ajuda você a acompanhar quem deixou de seguir o seu perfil
        do Instagram. Você envia a sua própria lista de seguidores, exportada
        oficialmente pelo Instagram, e nós comparamos com a lista anterior para
        mostrar as mudanças.
      </p>

      <h2>2. Sua conta</h2>
      <ul>
        <li>
          O acesso é feito com sua conta Google. Você é responsável por mantê-la
          segura.
        </li>
        <li>
          Você deve ter 13 anos ou mais (ou a idade mínima exigida no seu país).
        </li>
        <li>Uma conta é pessoal e individual.</li>
      </ul>

      <h2>3. Seus dados do Instagram</h2>
      <p>
        O FollowLens não pede a sua senha do Instagram e não acessa a sua conta
        do Instagram. Você obtém a sua lista de seguidores pela ferramenta
        oficial &ldquo;Exportar suas informações&rdquo; do Instagram e a envia
        para o Serviço. Você declara que os dados enviados são seus.
      </p>

      <h2>4. Uso aceitável</h2>
      <ul>
        <li>Não envie dados de terceiros sem autorização.</li>
        <li>
          Não tente burlar limites, acessar dados de outros usuários ou
          prejudicar o Serviço.
        </li>
      </ul>

      <h2>5. Planos e limites</h2>
      <p>
        O Serviço pode oferecer um plano gratuito com limites de uso e planos
        pagos com limites maiores. Os limites e preços podem mudar, com aviso
        prévio quando aplicável.
      </p>

      <h2>6. Isenção de garantias</h2>
      <p>
        O FollowLens não é afiliado, patrocinado nem endossado pelo Instagram ou
        pela Meta. O Serviço é fornecido &ldquo;como está&rdquo;, sem garantias
        de disponibilidade ininterrupta ou de que detectará todas as mudanças.
      </p>

      <h2>7. Encerramento</h2>
      <p>
        Você pode excluir sua conta a qualquer momento, o que remove seus dados.
        Podemos suspender contas que violem estes Termos.
      </p>

      <h2>8. Contato</h2>
      <p>
        Dúvidas sobre estes Termos? Fale com o suporte pelo e-mail informado no
        aplicativo.
      </p>
    </LegalLayout>
  );
}
