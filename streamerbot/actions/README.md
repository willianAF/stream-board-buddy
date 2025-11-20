# StreamerBot – Actions

Este diretório contém as Actions do StreamerBot utilizadas no projeto, juntamente com seus respectivos códigos C# e arquivos de exportação gerados diretamente pelo StreamerBot.

Cada Action possui:

- Código C# implementado manualmente
- Arquivo `.export.txt` contendo o export original do StreamerBot
- Organização por domínio (ex.: `messages`, `playerqueue`)

---

## 📥 Importando no StreamerBot

Para importar qualquer Action:

1. Abra o StreamerBot  
2. Vá em: **Actions → Import**  
3. Selecione o arquivo `.export.txt` correspondente  
4. Confirme a importação  

---

## ⚠️ **Importante: não esqueça de habilitar tudo após importar!**

Depois de importar os arquivos `.export.txt`, é necessário **habilitar manualmente**:

### ✔ As Actions  
### ✔ Os Triggers 
### ✔ Os Commands

Se algum deles ficar desabilitado, a Action simplesmente **não vai executar**, mesmo se o código estiver correto.

---
