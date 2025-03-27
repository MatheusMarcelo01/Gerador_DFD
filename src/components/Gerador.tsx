"use client";

import React, { useState } from "react";
import { saveAs } from "file-saver";
import * as ExcelJS from "exceljs";

// Função para capitalizar a primeira letra de cada palavra
const capitalizeWords = (str: string) => {
  return str
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const Gerador = () => {
  const [formData, setFormData] = useState({
    responsavel: "",
    objeto: "",
    justificativa: "",
    localEntrega: "",
    ficha: "",
    valorEstimado: "",
    setor: "",
    itens: [{ quantidade: "", unidade: "Material", descricao: "" }], // Padrão "Material"
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
      itens: [...formData.itens, { quantidade: "", unidade: "Material", descricao: "" }], // Padrão "Material"
    });
  };

  // Função para resetar os campos do formulário
  const resetForm = () => {
    setFormData({
      responsavel: "",
      objeto: "",
      justificativa: "",
      localEntrega: "",
      ficha: "",
      valorEstimado: "",
      setor: "",
      itens: [{ quantidade: "", unidade: "Material", descricao: "" }],
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

            worksheet.getRow(17).height = 2.35;

            // Capitalizando as palavras e substituindo valores das células com os dados do formulário
            worksheet.getCell("K4").value = capitalizeWords(formData.setor);
            worksheet.getCell("K5").value = capitalizeWords(formData.responsavel);
            worksheet.getCell("C11").value = capitalizeWords(formData.objeto);
            worksheet.getCell("C14").value = capitalizeWords(formData.justificativa);
            worksheet.getCell("J16").value = capitalizeWords(formData.ficha);
            worksheet.getCell("J59").value = capitalizeWords(formData.localEntrega);
            worksheet.getCell("C53").value = "R$ " + formData.valorEstimado;

            // Inserindo o valor do responsável na célula F62
            worksheet.getCell("F62").value = capitalizeWords(formData.responsavel);

            // Inserindo o valor do setor na célula F63
            worksheet.getCell("F63").value = capitalizeWords(formData.setor);

            // Atualizando a célula de data (C60)
            const today = new Date();
            const day = today.getDate();
            const monthNames = [
              "janeiro",
              "fevereiro",
              "março",
              "abril",
              "maio",
              "junho",
              "julho",
              "agosto",
              "setembro",
              "outubro",
              "novembro",
              "dezembro",
            ];
            const month = monthNames[today.getMonth()];
            const year = today.getFullYear();
            const formattedDate = `Manduri, ${day} de ${month} de ${year}`;
            worksheet.getCell("C60").value = formattedDate;

            // Atualizando os itens (C23 até C47, G23 até G47, J23 até J47, K23 até K47)
            formData.itens.forEach((item, index) => {
              // Calcular a linha correspondente para o item
              const row = 23 + index;

              if (row <= 47) {
                // Atualizando os dados das células
                worksheet.getCell(`C${row}`).value = `Item ${String(index + 1).padStart(2, "0")}`;
                worksheet.getCell(`G${row}`).value = item.quantidade;
                worksheet.getCell(`J${row}`).value = item.unidade;
                worksheet.getCell(`K${row}`).value = item.descricao;
              }
            });

            // Gerar o arquivo Excel atualizado com o nome baseado no setor
            const fileName = `DFD_${formData.setor}.xlsx`; // Nome do arquivo com o setor
            wb.xlsx.writeBuffer().then((buffer) => {
              saveAs(new Blob([buffer]), fileName);

              // Resetando os campos após a geração do arquivo
              resetForm();
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
          
          <select
            className="border p-2"
            name="unidade"
            value={item.unidade}
            onChange={(e) => handleChange(e, index)}
          >
            <option value="Material">Material</option>
            <option value="Serviço">Serviço</option>
          </select>
          
          <input
            className="border p-2 w-3/4"  // Aumenta a largura do campo de descrição
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
