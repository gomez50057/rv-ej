import Link from "next/link";
import styles from "./home.module.css";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.kicker}>Demo VR / Cardboard</p>
        <h1>Maqueta urbana interactiva</h1>
        <p>
          Ejemplo base con una maqueta 3D, puntos de salto por mirada y tres modos:
          vista maqueta, vista peatonal y vista guiada.
        </p>
        <Link href="/recorrido-vr" className={styles.button}>
          Abrir recorrido VR
        </Link>
      </section>
    </main>
  );
}
