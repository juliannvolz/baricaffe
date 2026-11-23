import type { StaticImageData } from "next/image";
import { bari } from "@/lib/tokens";
import basket from "@/public/assets/cesta1-1280w.webp";
import drinks from "@/public/assets/drinks-bari-1920w.webp";
import cream from "@/public/assets/goomer-2-800w.webp";
import tapioca from "@/public/assets/goomer-3-800w.webp";
import ninho from "@/public/assets/goomer-5-800w.webp";
import cake from "@/public/assets/goomer-6-800w.webp";
import croissant from "@/public/assets/ig-csogzkou-2-1280w.webp";
import fondue from "@/public/assets/ig-fondue-cover-800w.webp";

export type MenuItem = {
  name: string;
  note: string;
  tag: string;
  image: StaticImageData;
  alt: string;
};

export const menuItems: MenuItem[] = [
  {
    name: "Croissant belga",
    note: "Chocolate belga, avelã tostada e trufa. O que fez a casa ser conhecida.",
    tag: "assinatura",
    image: croissant,
    alt: "Croissant folhado coberto com chocolate belga e avelãs tostadas",
  },
  {
    name: "Croissant cremoso",
    note: "Creme fresco, coco e açúcar. Para quem gosta de recheio até o fim.",
    tag: "clássico",
    image: cream,
    alt: "Croissant recheado com creme e coco ralado",
  },
  {
    name: "Leite ninho",
    note: "Doce de leite ninho, sorvete e crocante. Doce na medida.",
    tag: "doce",
    image: ninho,
    alt: "Doce de leite ninho com sorvete",
  },
  {
    name: "Brie & presunto cru",
    note: "Tapioca crocante, brie derretido e presunto cru. O salgado da mesa.",
    tag: "salgado",
    image: tapioca,
    alt: "Tapioca com brie e presunto cru",
  },
  {
    name: "Bolo ninho",
    note: "Camadas de leite ninho, sorvete e calda. Para dividir ou não.",
    tag: "sobremesa",
    image: cake,
    alt: "Bolo de leite ninho com sorvete",
  },
  {
    name: "Drinks da casa",
    note: "Fruta, flor e gelo. Três receitas feitas para brindar na mesa.",
    tag: "para dividir",
    image: drinks,
    alt: "Três drinks coloridos com flores, em bandeja, no salão da Bari",
  },
  {
    name: "Fondue",
    note: "Nosso blend quente, frutas, marshmallows e pão de mel. Sexta e sábado.",
    tag: "inverno",
    image: fondue,
    alt: "Fondue de chocolate com frutas e marshmallows",
  },
  {
    name: "Cesta de café da manhã",
    note: "Pães, frutas, doces e café na caixa da Bari. Montada para presentear.",
    tag: "presente",
    image: basket,
    alt: "Cesta de café da manhã da Bari com pães, morangos, waffles e queijos",
  },
];

export const stats = [
  { value: bari.rank, label: "café no TripAdvisor em Jaraguá" },
  { value: `${bari.rating}★`, label: "média no Google" },
  { value: bari.reviews, label: "avaliações de clientes" },
] as const;

export const timeline = [
  {
    time: "12h",
    title: "Brunch",
    note: "Cestas, pães e cafés para começar sem pressa.",
  },
  {
    time: "15h",
    title: "Café da tarde",
    note: "Croissant, bolo e chocolate quente. O meio da tarde é nosso.",
  },
  {
    time: "18h",
    title: "Fondue",
    note: "Sexta e sábado, para dividir. Melhor garantir pelo WhatsApp.",
  },
  {
    time: "20h",
    title: "Fechamento",
    note: "Terça a sábado, às 20h. Domingo, às 19h.",
  },
] as const;

export const gifts = [
  {
    title: "Cesta de café da manhã",
    note: "Pães, doces, frutas e café. Montada para o presente.",
  },
  {
    title: "Brownie com flores",
    note: "Caixa da Bari, fita e flores frescas da Amariles.",
  },
  {
    title: "Brunch para grupos",
    note: "Mesa completa para comemorar com quem você gosta.",
  },
] as const;

export const faqs = [
  {
    q: "Precisa reservar?",
    a: "Para grupos, sim. Chame no WhatsApp e a gente organiza a mesa.",
  },
  {
    q: "Quando tem fondue?",
    a: "Sexta e sábado. É melhor garantir pelo WhatsApp antes de vir.",
  },
  {
    q: "Fazem encomendas?",
    a: "Sim: cestas de café da manhã, brownies com flores e brunch para grupos.",
  },
  {
    q: "Entregam em outras cidades?",
    a: "Delivery somente em Jaraguá do Sul. Cidades vizinhas, atendimento pelo WhatsApp.",
  },
  {
    q: "Qual é o horário?",
    a: "Terça a sábado, das 12h às 20h. Domingo, das 15h às 19h.",
  },
] as const;

/**
 * Avaliações reais do Google (4,6 · 796). Trechos verbatim, cortados em
 * fronteira de frase; primeiro nome + inicial, como no perfil público.
 */
export const reviews = [
  {
    author: "Willian N.",
    avatar: "WN",
    rating: 5,
    text: "Atendimento cordial, som ambiente, e o ponto forte é a decoração e ambientação que enchem os olhos. Pratos saborosos, valores justos.",
    source: "Avaliação do Google",
  },
  {
    author: "Silvana",
    avatar: "S",
    rating: 5,
    text: "Saímos de Joinville para conhecer e valeu a pena. Ambiente lindíssimo, climatizado, limpo, aconchegante.",
    source: "Avaliação do Google",
  },
  {
    author: "Ketryn G.",
    avatar: "KG",
    rating: 5,
    text: "Um dos cafés mais lindos que já vi, com uma decoração toda rosa, pensada nos mínimos detalhes. Um lugar que dá vontade de voltar sempre.",
    source: "Avaliação do Google",
  },
  {
    author: "Desbravando A.",
    avatar: "DA",
    rating: 5,
    text: "Um ambiente perfeito e comida deliciosa, o melhor café de Jaraguá.",
    source: "Avaliação do Google",
  },
] as const;

export const navLinks = [
  { href: "#cardapio", label: "Cardápio" },
  { href: "#lugar", label: "O lugar" },
  { href: "#presentes", label: "Presentes" },
  { href: "#visitar", label: "Visitar" },
] as const;
