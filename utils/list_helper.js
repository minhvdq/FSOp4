const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return sum += blog.likes
    }, 0)
}

const bestBlog = (blogs) => {
    let maxId;
    let maxLikes = 0
    for(const blog of blogs){
        if(maxLikes < blog.likes){
            maxId = blog._id
            maxLikes = blog.likes
        }
    }
    const maxBlog = blogs.find(blog => blog._id === maxId)
    console.log(maxBlog)
    console.log(maxId )
    const result =  {
        title: maxBlog.title,
        author: maxBlog.author,
        likes: maxBlog.likes
    }
    console.log( result )
    return result
}

const checkName = (array, authorName) => {
    for( const element of array){
        if ( authorName === element.author ){
            return false
        }
    }
    return true 
}
const mostBlog = (blogs) => {
    let authorList = []
    for(const blog of blogs){
        if(authorList === [] || checkName(authorList, blog.author)){
            const newElement = {
                author: blog.author,
                blogs: 1
            }
            authorList.push(newElement)
            continue
        }
        for(let i = 0; i < authorList.length; i++){
            if(authorList[i].author === blog.author){
                authorList[i].blogs ++
            }
        }
    }
    let maxBlog = 0
    let maxIndex = 0
    let cnt = 0
    for(const author of authorList){
        if(maxBlog < author.blogs){
            maxBlog = author.blogs
            maxIndex = cnt
            cnt ++
        }
    }
    console.log(authorList)
    return authorList[maxIndex]
}

const mostBlogLikes= (blogs) => {
    let authorList = []
    for(const blog of blogs){
        if(authorList === [] || checkName(authorList, blog.author)){
            const newElement = {
                author: blog.author,
                likes: blog.likes
            }
            authorList.push(newElement)
            continue
        }
        for(let i = 0; i < authorList.length; i++){
            if(authorList[i].author === blog.author){
                authorList[i].likes += blog.likes
            }
        }
    }
    let maxLikes = 0
    let maxIndex = 0
    let cnt = 0
    for(const author of authorList){
        if(maxLikes < author.likes){
            maxLikes= author.likes
            maxIndex = cnt
            cnt ++
        }
    }
    console.log(authorList)
    return authorList[maxIndex]
}

module.exports = {
    totalLikes,
    bestBlog,
    mostBlog,
    mostBlogLikes
}