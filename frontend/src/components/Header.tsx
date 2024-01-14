import { useState, type MouseEvent } from "react"
import About from "./About"

interface ICustomLinkProps {
  url: string
  label: string
  children?: React.ReactNode
}

const CustomLink = ({ url, label, children }: ICustomLinkProps) => {
  return <a href={url} className="hover:text-blue-500 underline underline-offset-4">{label}{children}</a>
}

const Header = () => {
  const [showAbout, setShowAbout] = useState(false)

  function handleShowAbout(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    setShowAbout(prev => !prev);
  }

  const navLinks: ICustomLinkProps[] = [
    {
      url: "https://github.com/aaanh",
      label: "@aaanh"
    },
    {
      url: "https://github.com/aaanh/reroll.ing",
      label: "source"
    },
    {
      url: "https://aaanh.com",
      label: "homepage"
    },
    {
      url: "/servants",
      label: "servants index"
    }
  ]

  return <div className="my-4 text-center">
  <h1 className="font-light text-4xl">Reroll.ing</h1>
  <p>
    {navLinks.map((link: ICustomLinkProps, idx: number) => <>
      <CustomLink key={idx} url={link.url} label={link.label}>{link.children ?? null}</CustomLink>&nbsp;|&nbsp;
    </>
    )}
    <button className="hover:text-blue-500 underline underline-offset-4" onClick={handleShowAbout}>about</button>
  </p>
  <About setShow={handleShowAbout} show={showAbout}></About>
</div>
}

export default Header