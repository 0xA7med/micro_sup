interface LoginFormProps {
    onLogin: (username: string, password: string) => Promise<void>;
    isLoading: boolean;
}
export default function LoginForm({ onLogin, isLoading }: LoginFormProps): import("react/jsx-runtime").JSX.Element;
export {};
