"use client";

import React, { useState } from "react";
import { saveAs } from "file-saver";
import * as ExcelJS from "exceljs";

const Gerador = () => {
  const [formData, setFormData] = useState({
    solicitante: "",
    responsavel: "",
    objeto: "",
    justificativa: "",
    localEntrega: "",
    ficha: "",
    valorEstimado: "",
    setor: "",
    itens: [{ quantidade: "", unidade: "", descricao: "" }],
  });

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const updatedItens = [...formData.itens];
      updatedItens[index][name] = value;
      setFormData({ ...formData, itens: updatedItens });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      itens: [...formData.itens, { quantidade: "", unidade: "", descricao: "" }],
    });
  };

  const generateExcel = () => {
    const fileUrl = "/DFD.xlsx"; // Caminho do arquivo de modelo

    fetch(fileUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ao carregar arquivo: ${response.statusText}`);
        }
        return response.arrayBuffer();
      })
      .then((data) => {
        try {
          const workbook = new ExcelJS.Workbook();
          workbook.xlsx.load(data).then((wb) => {
            const worksheet = wb.getWorksheet(1); // Acessa a primeira planilha

            // Substituindo valores das células com os dados do formulário
            worksheet.getCell("K4").value = formData.setor;
            worksheet.getCell("K5").value = formData.responsavel;
            worksheet.getCell("C11").value = formData.objeto;
            worksheet.getCell("C14").value = formData.justificativa;
            worksheet.getCell("J16").value = formData.ficha;
            worksheet.getCell("J59").value = formData.localEntrega;
            worksheet.getCell("C53").value = formData.valorEstimado;

            // Atualizando os itens
            formData.itens.forEach((item, index) => {
              worksheet.getCell(`A${6 + index}`).value = item.quantidade;
              worksheet.getCell(`B${6 + index}`).value = item.unidade;
              worksheet.getCell(`C${6 + index}`).value = item.descricao;
            });

            // Gerar o arquivo Excel atualizado
            wb.xlsx.writeBuffer().then((buffer) => {
              saveAs(new Blob([buffer]), "DFD_Gerado.xlsx");
            });
          });
        } catch (error) {
          console.error("Erro ao processar o arquivo Excel:", error);
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar o arquivo:", error);
      });
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-xl font-bold mb-4">Gerar Documento de Formalização da Demanda</h1>
      
      <input
        className="border p-2 w-full mb-2"
        type="text"
        name="solicitante"
        placeholder="Nome do Solicitante"
        value={formData.solicitante}
        onChange={handleChange}
      />
      
      <input
        className="border p-2 w-full mb-2"
        type="text"
        name="responsavel"
        placeholder="Responsável pela Demanda"
        value={formData.responsavel}
        onChange={handleChange}
      />
      
      <textarea
        className="border p-2 w-full mb-2"
        name="objeto"
        placeholder="Objeto da Futura Contratação"
        value={formData.objeto}
        onChange={handleChange}
      />
      
      <textarea
        className="border p-2 w-full mb-2"
        name="justificativa"
        placeholder="Justificativa da Necessidade"
        value={formData.justificativa}
        onChange={handleChange}
      />
      
      <input
        className="border p-2 w-full mb-2"
        type="text"
        name="localEntrega"
        placeholder="Local de Entrega"
        value={formData.localEntrega}
        onChange={handleChange}
      />
      
      <input
        className="border p-2 w-full mb-2"
        type="text"
        name="setor"
        placeholder="Setor"
        value={formData.setor}
        onChange={handleChange}
      />
      
      <input
        className="border p-2 w-full mb-2"
        type="text"
        name="ficha"
        placeholder="Ficha"
        value={formData.ficha}
        onChange={handleChange}
      />
      
      <input
        className="border p-2 w-full mb-2"
        type="text"
        name="valorEstimado"
        placeholder="Valor Estimado"
        value={formData.valorEstimado}
        onChange={handleChange}
      />

      <h2 className="font-bold">Itens:</h2>
      {formData.itens.map((item, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            className="border p-2"
            type="text"
            name="quantidade"
            placeholder="Quantidade"
            value={item.quantidade}
            onChange={(e) => handleChange(e, index)}
          />
          <input
            className="border p-2"
            type="text"
            name="unidade"
            placeholder="Unidade"
            value={item.unidade}
            onChange={(e) => handleChange(e, index)}
          />
          <input
            className="border p-2"
            type="text"
            name="descricao"
            placeholder="Descrição"
            value={item.descricao}
            onChange={(e) => handleChange(e, index)}
          />
        </div>
      ))}
      
      <button className="bg-blue-500 text-white p-2 rounded" onClick={addItem}>
        Adicionar Item
      </button>
      
      <button
        className="bg-green-500 text-white p-2 rounded ml-2"
        onClick={generateExcel}
      >
        Gerar DFD
      </button>
    </div>
  );
};

export default Gerador;
