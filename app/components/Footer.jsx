"use client";

import { Footer } from "flowbite-react";

export function Footercomponent() {
  return (
    <Footer container className=" md:mb-0">
      <Footer.Copyright href="#" by="Tiffinbox" year={2022} />
      <Footer.LinkGroup className="flex gap-2">
        <Footer.Link href="#">About</Footer.Link>
        <Footer.Link href="#">Privacy Policy</Footer.Link>
        <Footer.Link href="#">Licensing</Footer.Link>
        <Footer.Link href="#">Contact</Footer.Link>
      </Footer.LinkGroup>
    </Footer>
  );
}