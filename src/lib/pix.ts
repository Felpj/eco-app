/**
 * Deriva o `src` da imagem do QR PIX a partir do que o provider devolve.
 *
 * O back guarda em `pixQrCode` uma IMAGEM do QR já renderizada (Mercado Pago:
 * base64 cru de PNG — `qr_code_base64`; TCR: data-URI). O copia-e-cola EMV vem
 * num campo separado (`paymentString`/`pixCopyPaste`).
 *
 * Por que existe: o front antigo jogava a imagem base64 no `data=` do
 * api.qrserver.com — que gera um QR a partir de TEXTO. Resultado: URL gigante
 * com a imagem inteira → QR não renderizava (o "21KB" verificado por HTTP nunca
 * foi um render de tela). Aqui a imagem do provider é usada DIRETO; o qrserver
 * fica só como fallback defensivo pra quando só existe o EMV.
 *
 * @param image conteúdo de `pixQrCode` — base64 cru de PNG OU data-URI completo
 * @param copiaECola string EMV copia-e-cola (`paymentString`)
 */
export function pixQrImageSrc(
  image?: string | null,
  copiaECola?: string | null,
): string | null {
  if (image && image.trim()) {
    return image.startsWith("data:") ? image : `data:image/png;base64,${image}`;
  }
  if (copiaECola && copiaECola.trim()) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=0&data=${encodeURIComponent(
      copiaECola,
    )}`;
  }
  return null;
}
