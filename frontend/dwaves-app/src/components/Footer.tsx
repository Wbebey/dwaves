import 'styles/Footer.scss'

interface FooterProps {
    envName: string
    buildDate: string
    commitUrl: string
}
export const Footer: React.FC<FooterProps> = ({ buildDate, envName, commitUrl }) => {
    const date = new Date(buildDate);

    return (
        <footer className="footer hidden">
            <p className="footer__item">Env: {envName}</p>
            <p className="footer__item">
                <a className='' href={commitUrl} target="_blank">
                    Build Date: {date.toLocaleString()}
                </a>
            </p>
        </footer>
    );
};
