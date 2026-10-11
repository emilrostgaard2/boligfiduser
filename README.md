# boligfiduser.dk

Statisk website (ren HTML/CSS/JS, ingen WordPress, ingen database).

## Upload til Simply.com via GitHub
1. Opret et nyt repository på GitHub og upload ALT indhold fra zip-filen til roden (inkl. den skjulte mappe .github og filen .htaccess).
2. I GitHub: Settings → Secrets and variables → Actions → tilføj:
   - FTP_SERVER: linux123.unoeuro.com (se dit FTP-værtsnavn i Simply-kontrolpanelet)
   - FTP_USERNAME: dit FTP-brugernavn fra Simply
   - FTP_PASSWORD: dit FTP-kodeord
   - FTP_DIR: /public_html/
3. Hver gang du pusher til main, uploades siden automatisk (fanen Actions viser status).

Alternativt: Upload filerne direkte til public_html via Simplys filhåndtering eller FTP.

## Efter upload
- Aktivér gratis SSL (Let's Encrypt) i Simply-kontrolpanelet.
- Tilføj siden i Google Search Console og indsend https://boligfiduser.dk/sitemap.xml
