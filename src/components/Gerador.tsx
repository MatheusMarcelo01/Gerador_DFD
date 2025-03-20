"use client";

import React, { useState } from "react";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } from "docx";

const Gerador = () => {
  const [formData, setFormData] = useState({
    solicitante: "",
    responsavel: "",
    objeto: "",
    justificativa: "",
    localEntrega: "",
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

  const generateDocument = () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ text: "DOCUMENTO DE FORMALIZAÇÃO DA DEMANDA – COMPRA DIRETA", bold: true }),
            new Paragraph(" "),
            new Paragraph(`Solicitante: ${formData.solicitante}`),
            new Paragraph(`Responsável pela Demanda: ${formData.responsavel}`),
            new Paragraph(" "),
            new Paragraph({ text: "Objeto da Futura Contratação", bold: true }),
            new Paragraph(formData.objeto),
            new Paragraph(" "),
            new Paragraph({ text: "Justificativa da Necessidade da Contratação", bold: true }),
            new Paragraph(formData.justificativa),
            new Paragraph(" "),
            new Paragraph({ text: "Local de Entrega", bold: true }),
            new Paragraph(formData.localEntrega),
            new Paragraph(" "),
            new Paragraph({ text: "Descrição e Quantitativos", bold: true }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("Quantidade")], width: { size: 20, type: WidthType.PERCENTAGE } }),
                    new TableCell({ children: [new Paragraph("Unidade")], width: { size: 30, type: WidthType.PERCENTAGE } }),
                    new TableCell({ children: [new Paragraph("Descrição")], width: { size: 50, type: WidthType.PERCENTAGE } }),
                  ],
                }),
                ...formData.itens.map((item) =>
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph(item.quantidade)] }),
                      new TableCell({ children: [new Paragraph(item.unidade)] }),
                      new TableCell({ children: [new Paragraph(item.descricao)] }),
                    ],
                  })
                ),
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "DFD_Gerado.docx");
    });
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-xl font-bold mb-4">Gerar Documento de Formalização da Demanda</h1>
      <input className="border p-2 w-full mb-2" type="text" name="solicitante" placeholder="Nome do Solicitante" onChange={handleChange} />
      <input className="border p-2 w-full mb-2" type="text" name="responsavel" placeholder="Responsável pela Demanda" onChange={handleChange} />
      <textarea className="border p-2 w-full mb-2" name="objeto" placeholder="Objeto da Futura Contratação" onChange={handleChange} />
      <textarea className="border p-2 w-full mb-2" name="justificativa" placeholder="Justificativa da Necessidade" onChange={handleChange} />
      <input className="border p-2 w-full mb-2" type="text" name="localEntrega" placeholder="Local de Entrega" onChange={handleChange} />
      <h2 className="font-bold">Itens:</h2>
      {formData.itens.map((item, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input className="border p-2" type="text" name="quantidade" placeholder="Quantidade" value={item.quantidade} onChange={(e) => handleChange(e, index)} />
          <input className="border p-2" type="text" name="unidade" placeholder="Unidade" value={item.unidade} onChange={(e) => handleChange(e, index)} />
          <input className="border p-2" type="text" name="descricao" placeholder="Descrição" value={item.descricao} onChange={(e) => handleChange(e, index)} />
        </div>
      ))}
      <button className="bg-blue-500 text-white p-2 rounded" onClick={addItem}>Adicionar Item</button>
      <button className="bg-green-500 text-white p-2 rounded ml-2" onClick={generateDocument}>Gerar DFD</button>
    </div>
  );
};

export default Gerador;
