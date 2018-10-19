const express = require('express');
const app = express();
const port = 3000;

/*
    Data generators
 */
function makeCategoryList() {
    return [
        {
            id : 1,
            name : "News"
        },
        {
            id : 2,
            name : "Features"
        },
        {
            id : 3,
            name : "Other"
        }
    ];
}
function makePost(postId, categoryIDs) {
    return {
        id : postId,
        category_id : categoryIDs ? categoryIDs[Math.floor(Math.random() * categoryIDs.length)] : null,
        title : `Title ${postId}`,
        excerpt : `Excerpt ${postId}`,
        body : `Body ${postId}`,
        tags : ['tag1', 'tag2', 'tag3'].join(' '),
        image : `https://picsum.photos/200/300?${postId}`,
        public_at : '01.03.2017',
        created_at : '06.06.2016',
        updated_at : '09.06.2016'
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
        'new' : Math.random() >= 0.5,
        sale : Math.random() >= 0.5,
        code : Math.floor(Math.random() * 999999),
        name : `Name ${groupID}`,
        fullname : `Full name ${groupID}`,
        description : `Description ${groupID}`,
        created_at : '06.06.2016',
        updated_at : '09.06.2016'
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
        group_id : groupID ? groupID : (Math.random() >= 0.5 ? Math.floor(Math.random() * 999999) : null),
        'new' : Math.random() >= 0.5,
        sale : Math.random() >= 0.5,
        code : Math.floor(Math.random() * 999999),
        name : `Name ${articleID}`,
        fullname : `Full name ${articleID}`,
        in_stock : Math.random() >= 0.5,
        created_at : '06.06.2016',
        updated_at : '09.06.2016'
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
            created_at : '01.01.2017',
            updated_at : '01.03.2017'
        },
        {
            id : 2,
            country_id : 1,
            name : 'Odessa',
            lng : 46.477076,
            lat : 30.729940,
            created_at : '01.01.2017',
            updated_at : '01.03.2017'
        },
        {
            id : 3,
            country_id : 1,
            name : 'Harkov',
            lng : 49.991658,
            lat : 36.280565,
            created_at : '01.01.2017',
            updated_at : '01.03.2017'
        }
    ];
}
function makeStore(storeID, citiesIDs) {
    return {
        id : storeID,
        name : `Store ${storeID}`,
        address : `Address ${storeID}`,
        site_url : `http://example.com?${storeID}`,
        telephone : `+46453763${storeID}`,
        order : Math.floor(Math.random()),
        city_id : citiesIDs[Math.floor(Math.random() * citiesIDs.length)]
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


app.listen(port, () => console.log(`Strikepro mock-server app listening on port ${port}!`));