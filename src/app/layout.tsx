"use client";
import Body from "@/components/body";
import { UseMode } from "@/contexts/themes/useTheme";
import type { Metadata } from "next";
import "@styles/global.scss";
import { Auth } from "@/contexts/auth";
import Loader from "@/contexts/loading";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UseMode>
      <Auth>
        <Loader>
          <html lang="en">
            <Body>
              <div className="bg-center">
                <div className="box">
                  <div className="form">{children} </div>{" "}
                </div>
              </div>
              <div id="portal-root"></div>
            </Body>
          </html>
        </Loader>
      </Auth>
    </UseMode>
  );
}
