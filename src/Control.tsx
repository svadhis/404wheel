import { copyData } from "./utils";

export default function Control() {
  // Récupérer et parser les données depuis localStorage
  const participations = JSON.parse(localStorage.getItem("participations") || "[]");

  // Trier par date décroissante et garder les 10 dernières
  const lastTen = [...participations]
    .sort((a, b) => {
      const [da, ha] = a.date.split(" ");
      const [db, hb] = b.date.split(" ");
      const [daDay, daMonth, daYear] = da.split("/").map(Number);
      const [dbDay, dbMonth, dbYear] = db.split("/").map(Number);
      const dateA = new Date(daYear, daMonth - 1, daDay, ...ha.split(":").map(Number));
      const dateB = new Date(dbYear, dbMonth - 1, dbDay, ...hb.split(":").map(Number));
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 10);

  return (
    <div className="p-8 bg-white w-screen h-screen text-g404-bleu rounded shadow-lg">
      <div className="flex justify-between">
        <h2>Dernières participations</h2>
        {/* <div className="flex space-x-2">
          <button onClick={copyData} className="bg-g404-violet text-white rounded px-2">
            Copier
          </button>
          <button onClick={() => localStorage.removeItem("participations")} className="bg-red-500 text-white rounded px-2">
            Vider
          </button>
        </div> */}
      </div>
      {lastTen.length === 0 ? (
        <p>Aucune donnée trouvée.</p>
      ) : (
        <table className="min-w-full border-collapse mt-4">
          <thead>
            <tr style={{ backgroundColor: "#eee" }}>
              <th style={th}>Nom</th>
              <th style={th}>Code postal</th>
              <th style={th}>Résultat</th>
              <th style={th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {lastTen.map((p, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={td}>{p.name || "-"}</td>
                <td style={td}>{p.cp || "-"}</td>
                <td style={td}>{p.result || "-"}</td>
                <td style={td}>{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = {
  textAlign: "left" as const,
  padding: "12px",
  borderBottom: "2px solid #ccc",
};

const td = {
  padding: "12px 12px",
};
