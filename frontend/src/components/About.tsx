import { type MouseEvent } from "react"

interface IAboutProps {
  show: boolean
  setShow: (e: MouseEvent<HTMLButtonElement>) => void
}

const About = ({ show, setShow }: IAboutProps) => {
  return show ? <main className="absolute top-0 bottom-0 left-0 right-0 bg-black z-50 p-8 flex justify-center">
    <article className="dark:prose-invert prose prose-p:text-left text-left">
      <h1>About this project</h1>
      <blockquote>This is a fun little Fate Grand/Order gacha simulator that is probably not the most fateful imitation of the real mechanisms in the game.</blockquote>
      <button className="rounded-full p-2 border hover:text-green-500 hover:border-green-500 transition-all ease-in-out duration-300" onClick={setShow}>{`Too long, ain't gon' read.`}</button>
      <p>{`Hi, I'm Anh H Nguyen.`}</p>
      <p>I am the developer of this web app. My motivation for creating this is seemingly trivial: I bought the domain <code>reroll.ing</code> back in October 2023. But the ulterior motive is to improve my skillsets with API-based full-stack app development, along with Golang, SQL(ite), and Python data manipulations. In addition, I am also honing DevSecOps, product releasing with Docker container, semver, and CI/CD with Github Actions. So far, I have learned a lot and had quite a rewarding time building this app.</p>
      <p>I want to note that this project is quite dear to me and that it is different from my past projects. It is a love-hate relationship playing FGO (JP), some people even say it is masochistic, so being able to develop something based on the material I enjoy is special. And it is different than others in terms of my ambition and the scale of the project itself. And finally, it helps me with the motivation for improving the app in the long run.</p>
      <p>Going forward, I am working on revamping the versioning, as well as completing the CI/CD automation, cuz they are currently WIP.</p>
      <p>Hope you enjoy playing around with this as much as I do.</p>
      <button className="rounded-full p-2 border hover:text-green-500 hover:border-green-500 transition-all ease-in-out duration-300" onClick={setShow}>Ok, good to know.</button>
    </article>
  </main> : null;
}

export default About;
