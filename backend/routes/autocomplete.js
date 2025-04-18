import { Router } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

const router = Router();

dotenv.config();

// autocomplete search on every letter (during listing creation - city only)
router.get('/owner/city', async (req, res, next) => {
    // get unfinished city query, and countryId to narrow search down
    const { query, countryId } = req.body;

    try {
        let url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=5&sort=-population`;

        if (countryId) {
            url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=${countryId}&namePrefix=${query}&limit=5&sort=-population`;
        }

        const options = {
            method: 'GET',
            url: url,
            headers: {
                'x-rapidapi-key': process.env.GEODB_API_KEY,
                'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
            }
        };

        // fetchh data
        const response = await axios.request(options);

        // post process data
        const cities = response.data.data.map((item) => {
            return item.city;
        });

        return res.json(cities);
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occured, please try again." });
    }
});

// autocomplete search on every letter (during listing creation - country only)
router.get('/owner/country', async (req, res, next) => {
    // get unfinished country query
    const { query } = req.body;

    try {
        const options = {
            method: 'GET',
            url: `https://wft-geo-db.p.rapidapi.com/v1/geo/countries?namePrefix=${query}&limit=5&sort=name`,
            headers: {
                'x-rapidapi-key': process.env.GEODB_API_KEY,
                'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
            }
        };

        // fetch data
        const response = await axios.request(options);

        // post process data
        const countries = response.data.data.map((item) => {
            return {
                countryId: item.code, // used for narrowing down city search
                countryName: item.name
            }
        });

        return res.json(countries);
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occured, please try again." });
    }
});

// autocomplete search on every letter (FOR MAIN SEARCH)
// how it works: first 2 results country, other 3 results cities => simple & effective
router.get('/search', async (req, res, next) => {
    // get unfinished query
    const { query } = req.body;

    try {
        const cityOptions = {
            method: 'GET',
            url: `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=3&sort=-population`,
            headers: {
                'x-rapidapi-key': process.env.GEODB_API_KEY,
                'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
            }
        };

        // fetch cities (3)
        const cityResponse = await axios.request(cityOptions);

        // post process cities
        const cities = cityResponse.data.data.map((item) => {
            return item.city + ", " + item.country;
        });

        const countryOptions = {
            method: 'GET',
            url: `https://wft-geo-db.p.rapidapi.com/v1/geo/countries?namePrefix=${query}&limit=2&sort=name`,
            headers: {
                'x-rapidapi-key': process.env.FALLBACK_GEODB_API_KEY, // use fallback api key to avoid rate limitation (probably goes against TOS, but this isn't commercial so its fine (probably?))
                'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
            }
        };

        // wait 1 second before continuing execution (api basic plan rate limit)
        // await new Promise((resolve) => {
        //     setTimeout(resolve, 1100);
        // });


        // fetch countries (2)
        const countryResponse = await axios.request(countryOptions);

        // post process countries
        const countries = countryResponse.data.data.map((item) => {
            return item.name;
        });

        // merge citiies and countries
        const countriesCities = {
            countries: [...countries],
            cities: [...cities]
        };

        return res.json(countriesCities);
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occured, please try again." });
    }
});

export default router;