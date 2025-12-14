import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import Sidebar from "@/components/dashboard/Sidebar";

// URL CORRIGIDA (Ngrok)
const API_BASE_URL = "https://hastily-preaseptic-myrle.ngrok-free.dev/database";

const RegisterOccurrence = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    type: "1",
    priority: "Media",
    victims: "",
    details: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("data", new Date().toISOString());
      data.append("victims", formData.victims || "Nenhuma");
      data.append("details", formData.details || "Sem detalhes");
      data.append("status", "Em_andamento");
      data.append("priority", formData.priority);
      data.append("occurrencetype", formData.type);

      // Coordenadas fixas para teste web (Centro de Recife)
      data.append("latitude", "-8.04756");
      data.append("longitude", "-34.87700");

      if (selectedFile) {
        data.append("images", selectedFile);
      }

      const response = await fetch(`${API_BASE_URL}/occurrence/registry`, {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        const txt = await response.text();
        throw new Error(txt || "Erro ao registrar");
      }

      toast.success("Ocorrência registrada!");
      navigate("/home");
    } catch (error: any) {
      console.error(error);
      toast.error("Erro: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F9F9F9] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/home"
            className="p-2 rounded-full bg-white hover:bg-gray-100 border shadow-sm"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-[#1650A7]">Nova Ocorrência</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white p-8 rounded-xl border shadow-sm space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Título</label>
              <input
                required
                name="title"
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-gray-50"
                placeholder="Ex: Incêndio em loja"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Tipo</label>
              <select
                name="type"
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-gray-50"
              >
                <option value="1">Incêndio</option>
                <option value="2">Resgate</option>
                <option value="3">APH</option>
                <option value="4">Prevenção</option>
                <option value="5">Ambiental</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Prioridade
            </label>
            <div className="flex gap-4">
              {["Baixa", "Media", "Alta"].map((p) => (
                <label
                  key={p}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="priority"
                    value={p}
                    onChange={handleChange}
                    defaultChecked={p === "Media"}
                  />
                  <span className="text-sm">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Evidência (Foto)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <UploadCloud size={32} className="mb-2 text-[#1650A7]" />
              <span className="text-sm">
                {selectedFile
                  ? selectedFile.name
                  : "Clique para selecionar uma foto"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Vítimas</label>
            <input
              name="victims"
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-gray-50"
              placeholder="Qtd e estado..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Detalhes</label>
            <textarea
              name="details"
              onChange={handleChange}
              rows={4}
              className="w-full p-3 border rounded-lg bg-gray-50"
              placeholder="Descreva a situação..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#1650A7] text-white font-bold rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
          >
            {isSubmitting ? "Enviando..." : "Registrar Ocorrência"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default RegisterOccurrence;
