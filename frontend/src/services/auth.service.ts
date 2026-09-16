export class AuthService {
  async login(email: string, password: string): Promise<void> {
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 401) {
        throw new Error("wrong_credentials");
      } else if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Login failed");
      }
    } catch (error) {
      throw error;
    }
  }

  async logOut(): Promise<void> {
    try {
      await fetch("http://localhost:8000/api/deconnection", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      throw error;
    }
  }
}
