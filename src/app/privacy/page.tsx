import type { Metadata } from "next";
import { LegalLayout } from "@/features/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Política de Privacidade"
      updatedAt="3 de outubro de 2026"
    >
      <p>
        Esta política explica quais dados o FollowLens coleta, como os usamos e
        quais são os seus direitos. Levamos a sua privacidade a sério.
      </p>

      <h2>1. Dados que coletamos</h2>
      <ul>
        <li>
          <strong>Conta:</strong> ao entrar com o Google, recebemos seu nome,
          e-mail e foto de perfil, para identificar sua conta.
        </li>
        <li>
          <strong>Seguidores:</strong> os @usuários da lista de seguidores que
          você envia, as datas e o histórico de mudanças (quem saiu, entrou ou
          voltou).
        </li>
        <li>
          <strong>Uso:</strong> registros técnicos mínimos para operar e
          proteger o Serviço.
        </li>
      </ul>
      <p>
        Não coletamos a sua senha do Instagram e não acessamos a sua conta do
        Instagram.
      </p>

      <h2>2. Como usamos os dados</h2>
      <ul>
        <li>Para comparar suas listas e mostrar quem deixou de seguir você.</li>
        <li>Para enviar a você alertas por e-mail sobre unfollows.</li>
        <li>Para operar, proteger e melhorar o Serviço.</li>
      </ul>
      <p>Não vendemos seus dados.</p>

      <h2>3. Compartilhamento</h2>
      <p>
        Compartilhamos dados apenas com provedores que operam o Serviço (por
        exemplo, hospedagem do banco de dados e envio de e-mail), estritamente
        para essas finalidades. Seus dados de seguidores são isolados por conta
        e não são visíveis para outros usuários.
      </p>

      <h2>4. Retenção e exclusão</h2>
      <p>
        Mantemos seus dados enquanto sua conta existir. Você pode excluir sua
        conta a qualquer momento, o que apaga seus dados de seguidores e
        histórico.
      </p>

      <h2>5. Seus direitos (LGPD)</h2>
      <p>
        Você pode acessar, corrigir ou excluir seus dados, e revogar o
        consentimento. Para exercer esses direitos, use as opções no aplicativo
        ou fale com o suporte.
      </p>

      <h2>6. Segurança</h2>
      <p>
        Usamos conexões criptografadas e boas práticas para proteger seus dados.
        Nenhum sistema é 100% seguro, mas trabalhamos para reduzir riscos.
      </p>

      <h2>7. Alterações</h2>
      <p>
        Podemos atualizar esta política. Mudanças relevantes serão informadas e
        poderão exigir um novo aceite.
      </p>
    </LegalLayout>
  );
}
