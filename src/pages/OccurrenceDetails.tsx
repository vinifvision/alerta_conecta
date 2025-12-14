import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Image as ImageIcon, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";

const API_BASE_URL = "https://hastily-preaseptic-myrle.ngrok-free.dev/database";

const TYPE_MAP: Record<number, string> = {
  1: "Incêndio",
  2: "Resgate",
  3: "APH",
  4: "Prevenção",
  5: "Ambiental",
  6: "Administrativa",
  7: "Desastre",
};

export default function OccurrenceDetails() {
  const { id } = useParams();
  const { state } = useLocation();

  const [occurrence, setOccurrence] = useState<any>(state?.occurrence || null);
  const [loading, setLoading] = useState(!state?.occurrence);
  const [imgError, setImgError] = useState(false);

  // Lógica da Imagem:
  // 1. Se tiver mockImage (dados falsos), usa ela.
  // 2. Se for dados reais, monta a URL do backend.
  const imageUrl = occurrence?.mockImage
    ? occurrence.mockImage
    : occurrence
    ? `${API_BASE_URL}/occurrence/${occurrence.id}/image?t=${Date.now()}`
    : "";

  useEffect(() => {
    if (state?.occurrence) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/occurrence/${id}`);
        if (!response.ok) throw new Error("Erro ao buscar detalhes");
        const data = await response.json();
        setOccurrence(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, state]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-[#1650A7]">
        <RefreshCw className="animate-spin mr-2" /> Carregando...
      </div>
    );
  if (!occurrence)
    return (
      <div className="h-screen flex items-center justify-center">
        Ocorrência não encontrada.
      </div>
    );

  const lat = Number(occurrence.latitude);
  const lng = Number(occurrence.longitude);
  const hasMap = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;

  const typeName =
    typeof occurrence.type === "object" && occurrence.type?.name
      ? occurrence.type.name
      : TYPE_MAP[Number(occurrence.occurrencetype)] ||
        TYPE_MAP[Number(occurrence.type)] ||
        "N/A";

  return (
    <div className="flex h-screen bg-[#F9F9F9] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/home"
            className="p-2 rounded-full bg-white hover:bg-gray-100 border shadow-sm transition"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Detalhes #{occurrence.id}
            </h1>
            <p className="text-sm text-gray-500">
              Registrado em {new Date(occurrence.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-[#1650A7]">
                  {occurrence.title || occurrence.titule || "Sem Título"}
                </h2>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold uppercase text-gray-600">
                  {occurrence.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-500 uppercase font-bold">
                    Tipo
                  </span>
                  <p className="font-medium">{typeName}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-500 uppercase font-bold">
                    Prioridade
                  </span>
                  <p
                    className={`font-bold ${
                      occurrence.priority === "Alta"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {occurrence.priority}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-500 uppercase font-bold">
                    Vítimas
                  </span>
                  <p className="font-medium">
                    {occurrence.victims || "Nenhuma"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">
                  Descrição
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                  {occurrence.details || "Sem descrição."}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-[400px] flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="text-[#1650A7]" size={20} /> Localização
              </h3>
              <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden relative border">
                {hasMap ? (
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Sem coordenadas GPS válidas.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ImageIcon className="text-[#1650A7]" size={20} /> Evidência
              </h3>

              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center relative group">
                {!imgError ? (
                  <img
                    src={imageUrl}
                    alt="Evidência"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onError={() => setImgError(true)}
                    onClick={() => window.open(imageUrl, "_blank")}
                  />
                ) : (
                  <div className="text-center p-4 text-gray-400">
                    <ImageIcon size={40} className="mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Imagem não disponível</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
