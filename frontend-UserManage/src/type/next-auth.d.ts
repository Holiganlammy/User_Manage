import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      userid: number;
      UserCode: string;
      fristName?: string;
      lastName?: string;
      Email?: string;
      access_token?: string;
      img_profile?: string;
      role_id?: number;
    };
  }
  interface User {
    userid: number;
    UserCode: string;
    fristName?: string;
    lastName?: string;
    Email?: string;
    access_token: string;
    img_profile?: string;
    role_id?: number;
  }

  interface JWT { // แก้จาก JTW เป็น JWT
    userid: number;
    UserCode: string;
    fristName?: string;
    lastName?: string;
    Email?: string;
    access_token?: string;
    img_profile?: string;
    role_id?: number;
  }
}
