import axios from "axios";
import { AppDataSource } from "../database";
import { Currency } from "../models";
import { config } from "../config";

const currencyRepository = AppDataSource.getRepository(Currency);

const API_URL = `https://openexchangerates.org/api/latest.json?app_id=${config.currency.exchangeApiKey}`; // Replace with your API provider
// const UPDATE_INTERVAL_HOURS = 24; // Update every 12 hours

export class CurrencyService {
  // Update all currencies by fetching the exchange rates -----------------------
  static async updateExchangeRates() {
    try {
      const response = await axios.get(API_URL);
      const rates = response.data.rates; // { "EUR": 0.85, "GBP": 0.74, "JPY": 110.2, ... }

      const currencies = await currencyRepository.find();

      for (const currency of currencies) {
        if (rates[currency.code]) {
          currency.conversion_rate = rates[currency.code];
          currency.modifiedAt = new Date();
          await currencyRepository.save(currency);
        }
      }
    } catch (error) {
      console.error("Error updating exchange rates:", error);
    }
  }

  // Create a currency ----------------------------------------------------------
  static async createCurrency(code: string, name: string, symbol: string) {
    const currency = currencyRepository.create({
      code,
      name,
      symbol,
    });
    return await currencyRepository.save(currency);
  }

  // Get all currencies from Currency Model --------------------------------------
  static async getAllCurrencies() {
    const currencies = await currencyRepository.find();
    return currencies;
  }
}
