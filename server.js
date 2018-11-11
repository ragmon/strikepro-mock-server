/*
    (c) 2018 Arthur Ragimov <arthur.ragimov@gmail.com>

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
    LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
    OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const Faker = require('faker');
const dateFormat = require('dateformat');
const path = require('path');

const express = require('express');
const app = express();
const port = 3000;

const dateMask = 'dd.mm.yyyy';
const dateTimeMask = 'HH:MM:ss dd.mm.yyyy';

const resourceTypes = ['group', 'article', 'post'];
const featureValueTypes = ['string', 'int', 'float', 'bool'];

/*
    Common generators
 */
function makeCountry(id) {
    return {
        id : id,
        name : Faker.lorem.words(),
        created_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask),
        updated_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask)
    };
}
function makeCountryList(count) {
    count = count || 10;
    const countries = [];
    for (let i = 1; i <= count; i++) {
        countries.push(makeCountry(i));
    }
    return countries;
}

/*
    Feed generators
 */
function makeResource(type) {
    type = type || Faker.random.arrayElement(resourceTypes);

    const generator = {
        'group' : [
            makeGroupList,
            (...parameters) => parameters
        ],
        'article' : [
            makeArticle,
            (...parameters) => parameters
        ],
        'post' : [
            makePost,
            (...parameters) => parameters
        ]
    };
    const callGenerator = (name, ...parameters) => {
        if (name in generator) {
            const modelFactory = generator[name][0];
            const argsFactory = generator[name][1];
            const arguments = argsFactory(...parameters);

            return modelFactory(...arguments);
        } else
            throw `Can't found generator ${name}.`;
    };
    const resourceType = Faker.random.arrayElement(resourceTypes);

    return callGenerator(resourceType);
}
function makeFeedItem(id) {
    return {
        id : id,
        cols : Faker.random.number({
            min : 1,
            max : 3
        }),
        background_color : Faker.internet.color(),
        resource : makeResource(id)
    };
}
function makeFeedItemList(pageNum, perPage) {
    const lastItemIndex = pageNum * perPage;
    const firstItemIndex = lastItemIndex - (perPage - 1);
    const items = [];
    for (let i = firstItemIndex; i < lastItemIndex; i++) {
        items.push(makeFeedItem(i));
    }
    return items;
}

/*
    Blog generators
 */
function makeCategory(id) {
    return {
        id : id,
        name : Faker.lorem.word()
    };
}
function makeFeedCategoryList(count) {
    if (!count) count = 3;
    const categories = [];
    for (let i = 1; i <= count; i++) {
        categories.push(makeCategory(i));
    }
    return categories;
}
function makeTagList(count) {
    if (!count) count = 3;
    const tags = [];
    for (let i = 1; i <= count; i++) {
        tags.push(Faker.lorem.word());
    }
    return tags;
}
function makePost(postId, categoryIDs) {
    return {
        id : postId,
        category_id : Faker.helpers.randomize(categoryIDs),
        title : Faker.lorem.words(),
        excerpt : Faker.lorem.sentence(),
        body : Faker.lorem.paragraphs(3, '<br>'),
        tags : makeTagList().join(' '),
        image : Faker.image.imageUrl(200, 300),
        public_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask),
        created_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask),
        updated_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask)
    };
}
function makePostList(pageNum, perPage, categoryID) {
    const lastItemIndex = pageNum * perPage;
    const firstItemIndex = lastItemIndex - (perPage - 1);
    const categoryIDs = makeFeedCategoryList().map((category) => { return category.id });
    const posts = [];
    for (let i = firstItemIndex; i < lastItemIndex; i++) {
        posts.push(makePost(i, categoryID ? [categoryID] : categoryIDs));
    }
    return posts;
}

/*
    Catalog generators
 */
function makeGroup(groupID) {
    return {
        id : groupID,
        is_product : Math.random() >= 0.5,
        series_id : 1,
        parent_id : 1,
        country_id : 1,
        manufacturer_id : 1,
        seasonality_id : 1,
        type_id : 1,
        'new' : Faker.random.boolean(),
        sale : Faker.random.boolean(),
        code : Math.floor(Math.random() * 999999),
        name : Faker.lorem.words(),
        fullname : Faker.lorem.words(),
        description : Faker.lorem.paragraphs(3, '<br>'),
        created_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask),
        updated_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask)
    };
}
function makeGroupList(pageNum, perPage) {
    const lastItemIndex = pageNum * perPage;
    const firstItemIndex = lastItemIndex - (perPage - 1);
    const groups = [];
    for (let i = firstItemIndex; i < lastItemIndex; i++) {
        groups.push(makeGroup(i));
    }
    return groups;
}
function makeArticle(articleID, groupID) {
    return {
        id : articleID,
        group_id : groupID ? groupID : Faker.random.number(),//groupID ? groupID : (Math.random() >= 0.5 ? Math.floor(Math.random() * 999999) : null),
        'new' : Faker.random.boolean(),
        sale : Faker.random.boolean(),
        code : Math.floor(Math.random() * 999999),
        name : Faker.lorem.words(),
        fullname : Faker.lorem.words(),
        in_stock : Faker.random.boolean(),
        created_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask),
        updated_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask)
    };
}
function makeArticleList(pageNum, perPage, groupID) {
    const lastItemIndex = pageNum * perPage;
    const firstItemIndex = lastItemIndex - (perPage - 1);
    const articles = [];
    for (let i = firstItemIndex; i < lastItemIndex; i++) {
        articles.push(makeArticle(i, groupID || null));
    }
    return articles;
}
function makeFeature(featureID) {
    return {
        id : featureID,
        title : Faker.lorem.words(),
        measurement : Faker.lorem.words(),
        description : Faker.lorem.words(),
        is_filter : Faker.random.boolean(),
        value_type : Faker.random.arrayElement(featureValueTypes),
        is_visible : Faker.random.boolean(),
        created_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask),
        updated_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask)
    };
}
function makeFeatureList(count) {
    count = count || 50;
    const features = [];
    for (let i = 1; i <= count; i++) {
        features.push(makeFeature(i));
    }
    return features;
}
function makeSeries(id) {
    return {
        id : id,
        name : Faker.lorem.words(),
        distinctive_feature_id : null,
        created_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask),
        updated_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask)
    };
}
function makeSeriesList(count) {
    count = count || 30;
    const series = [];
    for (let i = 1; i <= count; i++) {
        series.push(makeSeries(i));
    }
    return series;
}
function makeManufacturer(id) {
    return {
        id : id,
        name : Faker.lorem.words(),
        created_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask),
        updated_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask)
    };
}
function makeManufacturerList(count) {
    count = count || 10;
    const manufacturers = [];
    for (let i = 1; i <= count; i++) {
        manufacturers.push(makeManufacturer(i));
    }
    return manufacturers;
}
function makeType(id) {
    return {
        id : id,
        title : Faker.lorem.words(),
        description : Faker.lorem.words(),
        template : null,
        created_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask),
        updated_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask)
    };
}
function makeTypeList(count) {
    count = count || 10;
    const types = [];
    for (let i = 1; i <= count; i++) {
        types.push(makeType(i));
    }
    return types;
}
function makeSeasonality(id) {
    return {
        id : id,
        name : Faker.lorem.words(),
        created_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask),
        updated_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask)
    };
}
function makeSeasonalityList(count) {
    const seasonalities = [];
    for (let i = 1; i <= count; i++) {
        seasonalities.push(makeSeasonality(i));
    }
    return seasonalities;
}


/*
    Wherebuy generators
 */
function makeCityList(countryID) {
    countryID = countryID || 1;
    return [
        {
            id : 1,
            country_id : countryID,
            name : 'Kiev',
            lng : 50.454677,
            lat : 30.542362,
            created_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask),
            updated_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask)
        },
        {
            id : 2,
            country_id : countryID,
            name : 'Odessa',
            lng : 46.477076,
            lat : 30.729940,
            created_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask),
            updated_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask)
        },
        {
            id : 3,
            country_id : countryID,
            name : 'Harkov',
            lng : 49.991658,
            lat : 36.280565,
            created_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask),
            updated_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateMask)
        }
    ];
}
function makeStore(storeID, citiesIDs) {
    return {
        id : storeID,
        name : Faker.lorem.words(),
        address : Faker.address.streetAddress(),
        site_url : Faker.internet.url(),
        telephone : Faker.phone.phoneNumber(),
        order : Faker.random.number(),
        city_id : citiesIDs[Faker.random.number(citiesIDs.length)]
    };
}
function makeStoreList(pageNum, perPage) {
    const lastItemIndex = pageNum * perPage;
    const firstItemIndex = lastItemIndex - (perPage - 1);
    const citiesIDs = makeCityList().map((city) => { return city.id });
    const stores = [];
    for (let i = firstItemIndex; i < lastItemIndex; i++) {
        stores.push(makeStore(i, citiesIDs));
    }
    return stores;
}

// ### Routes #########################################################################################################

/*
    Common
 */
app.get('/api/v1/countries', (req, res) => {
    const countries = makeCountryList();

    res.send(JSON.stringify(countries));
});
app.get('/api/v1/:countryID/cities', (req, res) => {
    const countryID = req.params.countryID;
    const countries = makeCityList(countryID);

    res.send(JSON.stringify(countries));
});

/*
    Feed (main activity)
 */
app.get('/api/v1/feed/categories', (req, res) => {
    const categories = makeFeedCategoryList();

    res.send(JSON.stringify(categories));
});
app.get('/api/v1/feed', (req, res) => {
    const perPage = 50;
    const pageNum = req.query.page ? req.query.page : 1;
    const feedItemList = makeFeedItemList(pageNum, perPage);

    res.send(JSON.stringify(feedItemList));
});

/*
    Catalog
 */
app.get('/api/v1/catalog/group/:groupID', (req, res) => {
    const groupID = req.params.groupID;

    res.send(JSON.stringify(makeGroup(groupID)));
});
app.get('/api/v1/catalog/groups', (req, res) => {
    const perPage = 50;
    const pageNum = req.query.page ? req.query.page : 1;
    const groups = makeGroupList(pageNum, perPage);

    res.send(JSON.stringify(groups));
});
app.get('/api/v1/catalog/article/:articleID', (req, res) => {
    const articleID = req.params.articleID;
    const article = makeArticle(articleID);

    res.send(JSON.stringify(article));
});
app.get('/api/v1/catalog/group/:groupID/articles', (req, res) => {
    const perPage = 50;
    const pageNum = req.query.page ? req.query.page : 1;
    const groupID = req.params.groupID;
    const articles = makeArticleList(pageNum, perPage, groupID);

    res.send(JSON.stringify(articles));
});
app.get('/api/v1/catalog/features', (req, res) => {
    const features = makeFeatureList();

    res.send(JSON.stringify(features));
});
app.get('/api/v1/catalog/series', (req, res) => {
    const series = makeSeriesList();

    res.send(JSON.stringify(series));
});
app.get('/api/v1/catalog/manufacturers', (req, res) => {
    const manufacturers = makeManufacturerList();

    res.send(JSON.stringify(manufacturers));
});
app.get('/api/v1/catalog/types', (req, res) => {
    const types = makeTypeList();

    res.send(JSON.stringify(types));
});
app.get('/api/v1/catalog/seasonalities', (req, res) => {
    const seasonalities = makeSeasonalityList();

    res.send(JSON.stringify(seasonalities));
});

/*
    Blog
 */
app.get('/api/v1/blog/categories', (req, res) => {
    const categories = makeFeedCategoryList();

    res.send(JSON.stringify(categories));
});
app.get('/api/v1/blog/category/:categoryID', (req, res) => {
    const perPage = 50;
    const pageNum = req.query.page ? req.query.page : 1;
    const categoryID = req.params.categoryID;
    const posts = makePostList(pageNum, perPage, categoryID);

    res.send(JSON.stringify(posts));
});
app.get('/api/v1/blog/posts', (req, res) => {
    const perPage = 50;
    const pageNum = req.query.page ? req.query.page : 1;
    const posts = makePostList(pageNum, perPage);

    res.send(JSON.stringify(posts));
});
app.get('/api/v1/blog/post/:postID', (req, res) => {
    const postID = req.params.postID;
    const posts = makePost(postID);

    res.send(JSON.stringify(posts));
});

/*
    Where buy
 */
app.get('/api/v1/cities', (req, res) => {
    const cities = makeCityList();

    res.send(JSON.stringify(cities));
});
app.get('/api/v1/city/:cityID/stores', (req, res) => {
    const perPage = 50;
    const pageNum = req.query.page ? req.query.page : 1;
    const stores = makeStoreList(pageNum, perPage);

    res.send(JSON.stringify(stores));
});

/*
    Feedback
 */

app.post('/api/v1/feedback', (req, res) => {
    const inputData = {
        type : req.body.type,
        message : req.body.message,
        created_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateTimeMask)
    };

    res.send(JSON.stringify(inputData), 201);
});


// Static directory
app.use('/', express.static(path.join(__dirname, 'public')));


app.listen(port, () => console.log(`Strikepro mock-server app listening on port ${port}!`));