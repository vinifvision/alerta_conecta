import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BrainCircuit } from "lucide-react";
import { toast } from "sonner";
import Sidebar from "@/components/dashboard/Sidebar";

const RegisterOccurrence = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);

  // Listas compatíveis com o Backend
  const tiposModelo = [
    "Incêndio em Edifício",
    "Incêndio Florestal",
    "Acidente Veicular",
    "Resgate em Altura",
    "APH - Mal Súbito",
    "Salvamento Aquático",
    "Vazamento de Gás",
  ];
  const regioes = [
    "Centro",
    "Zona Norte",
    "Zona Sul",
    "Zona Oeste",
    "Região Metropolitana",
  ];

  const [formData, setFormData] = useState({
    title: "",
    type: tiposModelo[0],
    region: regioes[0],
    priority: "Média",
    victims: "",
    details: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. Chamar a IA
  const handlePredictPriority = async () => {
    setIsPredicting(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/predict-priority",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tipo: formData.type,
            regiao: formData.region,
            hora: new Date().getHours(),
          }),
        }
      );
      const data = await response.json();
      if (data.prioridade_sugerida) {
        setFormData((prev) => ({
          ...prev,
          priority: data.prioridade_sugerida,
        }));
        toast.success(`IA sugeriu: ${data.prioridade_sugerida}`);
      }
    } catch {
      toast.error("Erro na IA. Verifique se o backend está rodando.");
    } finally {
      setIsPredicting(false);
    }
  };

  // 2. Registrar Ocorrência (AGORA REAL)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        titulo: formData.title,
        tipo: formData.type,
        regiao: formData.region,
        prioridade: formData.priority,
        vitimas: formData.victims,
        detalhes: formData.details,
      };

      const response = await fetch("http://127.0.0.1:5000/api/occurrences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao salvar");

      toast.success("Ocorrência salva no banco de dados!");
      navigate("/dashboard"); // Vai para o Dashboard ver o número aumentar
    } catch (error) {
      console.error(error);
      toast.error("Erro ao conectar com o servidor.");
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
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Título</label>
            <input
              required
              name="title"
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-gray-50"
              placeholder="Ex: Fogo em apartamento"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Tipo</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-gray-50"
              >
                {tiposModelo.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Região</label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-gray-50"
              >
                {regioes.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-gray-700">
                Prioridade
              </label>
              <button
                type="button"
                onClick={handlePredictPriority}
                disabled={isPredicting}
                className="text-xs flex items-center gap-1 bg-[#1650A7] text-white px-3 py-1 rounded-full hover:bg-blue-800 transition disabled:opacity-50"
              >
                <BrainCircuit size={14} />
                {isPredicting ? "Calculando..." : "Sugerir com IA"}
              </button>
            </div>
            <div className="flex gap-4">
              {["Baixa", "Média", "Alta"].map((p) => (
                <label
                  key={p}
                  className={`flex-1 flex items-center justify-center gap-2 cursor-pointer p-3 rounded-lg border transition ${
                    formData.priority === p
                      ? "bg-white border-[#1650A7] ring-1 ring-[#1650A7]"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={p}
                    onChange={handleChange}
                    checked={formData.priority === p}
                    className="accent-[#1650A7]"
                  />
                  <span className="text-sm">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Vítimas</label>
            <input
              name="victims"
              type="number"
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-gray-50"
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Detalhes</label>
            <textarea
              name="details"
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border rounded-lg bg-gray-50"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#1650A7] text-white font-bold rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
          >
            {isSubmitting ? "Salvando..." : "Registrar Ocorrência"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default RegisterOccurrence;
