class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        let reqQuery = { ...this.queryString };
        const exludes = ['page', 'sort', 'limit', 'fields'];
        exludes.forEach((ele) => delete reqQuery[ele]);
        reqQuery = JSON.stringify(reqQuery);
        reqQuery = reqQuery.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);
        this.query = this.query.find(JSON.parse(reqQuery));
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
            //sort('price ratingAverage')
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    pagination() {
        if (this.queryString.page) {
            const limit = this.queryString.limit ? parseInt(this.queryString.limit) : 100;
            const page = parseInt(this.queryString.page);
            // const cntDoc = await Tour.countDocuments();
            // if ((page - 1) * limit > cntDoc) {
            //     throw new Error('Page Limit Exceeded!');
            // }
            this.query = this.query.skip((page - 1) * limit).limit(limit);
        } else {
            const limit = this.queryString.limit ? parseInt(this.queryString.limit) : 100;
            this.query = this.query.skip(0).limit(limit);
        }
        return this;
    }
}

module.exports = APIFeatures;
