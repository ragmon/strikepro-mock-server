const Faker = require('faker');
const dateFormat = require('dateformat');
const path = require('path');

const express = require('express');
const app = express();
const port = 3000;

const dateTimeMask = 'dd.mm.yyyy';

/*
    Data generators
 */
function makeCategory(id) {
    return {
        id : id,
        name : Faker.lorem.word()
    };
}
function makeCategoryList(count) {
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
        public_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateTimeMask),
        created_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateTimeMask),
        updated_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateTimeMask)
    };
}
function makePostList(pageNum, perPage, categoryID) {
    const lastItemIndex = pageNum * perPage;
    const firstItemIndex = lastItemIndex - (perPage - 1);
    const categoryIDs = makeCategoryList().map((category) => { return category.id });
    const posts = [];
    for (let i = firstItemIndex; i < lastItemIndex; i++) {
        posts.push(makePost(i, categoryID ? [categoryID] : categoryIDs));
    }
    return posts;
}

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
        created_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateTimeMask),
        updated_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateTimeMask)
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
        created_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateTimeMask),
        updated_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateTimeMask)
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

function makeCityList() {
    return [
        {
            id : 1,
            country_id : 1,
            name : 'Kiev',
            lng : 50.454677,
            lat : 30.542362,
            created_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateTimeMask),
            updated_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateTimeMask)
        },
        {
            id : 2,
            country_id : 1,
            name : 'Odessa',
            lng : 46.477076,
            lat : 30.729940,
            created_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateTimeMask),
            updated_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateTimeMask)
        },
        {
            id : 3,
            country_id : 1,
            name : 'Harkov',
            lng : 49.991658,
            lat : 36.280565,
            created_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateTimeMask),
            updated_at : dateFormat(Faker.date.between('01/01/2017', '01/01/2018'), dateTimeMask)
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

/*
    Blog
 */
app.get('/api/v1/blog/categories', (req, res) => {
    const categories = makeCategoryList();

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

// TODO: release feedback routes


// Static directory
app.use('/', express.static(path.join(__dirname, 'public')));


app.listen(port, () => console.log(`Strikepro mock-server app listening on port ${port}!`));