import { createSlice } from '@reduxjs/toolkit';
import { COLORS, icons } from '../constants';

const income = 'income';
const expense = 'expense';

const catSlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [
      {
        id: 1,
        name: 'Vente',
        icon: icons.shopping,
        cat: income,
        color: COLORS.purple,
        data: [
          {
            id: 1,
            description: 'Vente 1kg de Legumes frais',
            total: 100.0,
            date: '2023-04-10',
          },
        ],
      },
      {
        id: 2,
        name: 'Remboursement',
        icon: icons.refund,
        cat: income,
        color: COLORS.blue,
        data: [
          {
            id: 1,
            description: 'Frais de déplacement pour la réunion avec le client',
            total: 50.0,
            date: '2023-04-11',
          },
          {
            id: 2,
            description: 'Déjeuner avec le client',
            total: 25.0,
            date: '2023-04-12',
          },
        ],
      },
      {
        id: 3,
        name: 'Intérêt',
        icon: icons.interest,
        cat: income,
        color: COLORS.darkgreen,
        data: [
          {
            id: 1,
            description: "Intérêts sur les comptes d'épargne",
            total: 10.0,
            date: '2023-04-15',
          },
        ],
      },
      {
        id: 4,
        name: 'Subvention',
        icon: icons.grant,
        cat: income,
        color: COLORS.red,
        data: [
          {
            id: 1,
            description: 'Subvention pour le projet de recherche',
            total: 5000.0,
            date: '2023-04-20',
          },
        ],
      },
      {
        id: 5,
        name: 'Investissement',
        icon: icons.investment,
        cat: income,
        color: COLORS.peach,
        data: [
          {
            id: 1,
            description: "Achat d'un immeuble à usage commercial",
            total: 100000.0,
            date: '2023-04-30',
          },
        ],
      },

      {
        id: 6,
        name: 'Achat',
        icon: icons.shopping,
        cat: expense,
        color: COLORS.lightBlue,
        data: [
          {
            id: 1,
            description: 'Achat 1kg de Legumes frais',
            total: 100.0,
            date: '2023-04-10',
          },
        ],
      },
      {
        id: 7,
        name: 'Salaire',
        icon: icons.cash,
        cat: expense,
        color: COLORS.peach,
        data: [
          {
            id: 1,
            description: "Salaire pour le mois d'avril",
            total: 50.0,
            date: '2023-04-11',
          },
          {
            id: 2,
            description: 'Salaire pour le mois de mars',
            total: 25.0,
            date: '2023-03-12',
          },
        ],
      },
      {
        id: 8,
        name: "Dépenses d'exploitation",
        icon: icons.cashbook,
        cat: expense,
        color: COLORS.darkgreen,
        data: [
          {
            id: 1,
            description: 'Loyer mensuel',
            total: 10.0,
            date: '2023-04-15',
          },
          {
            id: 1,
            description: 'Location voiture',
            total: 13.0,
            date: '2023-04-15',
          },
        ],
      },
      {
        id: 9,
        name: "Retraits d'argent",
        icon: icons.sell,
        cat: expense,
        color: COLORS.red,
        data: [
          {
            id: 1,
            description: "Retrait d'argent aupres de la TMB",
            total: 1500.0,
            date: '2023-04-20',
          },
        ],
      },
      {
        id: 10,
        name: 'Paiements de dettes',
        icon: icons.income,
        cat: expense,
        color: COLORS.yellow,
        data: [
          {
            id: 1,
            description: 'Paiement de prêt étudiant Janvier',
            total: 100000.0,
            date: '2023-04-30',
          },
          {
            id: 2,
            description: 'Paiement de prêt étudiant Fevrier',
            total: 100000.0,
            date: '2023-04-30',
          },
          {
            id: 3,
            description: 'Paiement de prêt étudiant Mars',
            total: 100000.0,
            date: '2023-04-30',
          },
          {
            id: 4,
            description: 'Paiement de prêt étudiant Avril',
            total: 100000.0,
            date: '2023-04-30',
          },
          {
            id: 11,
            description: 'Paiement de prêt étudiant Mai',
            total: 100000.0,
            date: '2023-04-30',
          },
          {
            id: 12,
            description: 'Paiement de prêt étudiant Juin',
            total: 100000.0,
            date: '2023-04-30',
          },
          {
            id: 13,
            description: 'Paiement de prêt étudiant Juillet',
            total: 100000.0,
            date: '2023-04-30',
          },
          {
            id: 14,
            description: 'Paiement de prêt étudiant Aout',
            total: 100000.0,
            date: '2023-04-30',
          },
        ],
      },
      {
        id: 11,
        name: 'Autres',
        icon: icons.more,
        cat: income,
        color: COLORS.peach,
        data: [],
      },

      {
        id: 12,
        name: 'Autres',
        icon: icons.more,
        cat: expense,
        color: COLORS.peach,
        data: [],
      },
    ],
  },
  reducers: {
    addCat: (state, action) => {
      state.categories = action.payload;
    },
  },
});

export const { addCat } = catSlice.actions;

export default catSlice.reducer;
