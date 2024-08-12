import WalletDisplay from "./WalletDisplay";

const Header = () => {
    return (
        <div className="flex flex-row-reverse border p-4">
            <WalletDisplay />
        </div>
    );
}

export default Header;