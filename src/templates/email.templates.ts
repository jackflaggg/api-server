export const emailTemplates = {
    registrationEmailTemplate(code: string) {
        console.log('это код email: ' + code);
        return `<h1>Благодарю за регистрацию!</h1>
        <p>До финиша еще чуть-чуть, перейди по данной ссылке, чтобы активировать аккаунт:
            <a href='https://localhost.com/confirm-email?code=${code}'>complete registration</a>
        </p>`;
    },
};
