import React from "react";
import * as AuthSession from "expo-auth-session";
interface AuthProviderProps {
  children: React.ReactNode;
}

interface IUser {
  id: string | number;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: IUser;
  signInWithGoogle(): Promise<void>;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  };
  type: string;
}

const AuthContext = React.createContext({} as IAuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = React.useState<IUser>({} as IUser);

  async function signInWithGoogle(): Promise<void> {
    try {
      const CLIENT_ID =
        "917832350079-4gf8qkl7vaa5uljgsp9ljm65mu19oc6d.apps.googleusercontent.com";
      const REDIRECT_URI = "https://auth.expo.io/@alexf1796/gofinances";
      const RESPONSE_TYPE = "token";
      const SCOPE = encodeURI("profile email");

      const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const { type, params } = (await AuthSession.startAsync({
        authUrl,
      })) as AuthorizationResponse;
      if (type === "success") {
        const response = await fetch(
          `https://wwww.googleapis.com/oauth2/v1/userinfo?alt=json&access_token${params.access_token}`
        );
        const userInfo = await response.json();
        setUser({
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.given_name,
          photo: userInfo.picture,
        });

        console.log(userInfo);
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
