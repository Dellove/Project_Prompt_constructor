import './Home.css'
import TypeWriter from './components/Type.js'
export const Home=()=> {
  return (
    <div>
        <TypeWriter text="Сгенерируй любой промпт на свой вкус" speed={50} />
    </div>
  );
}
