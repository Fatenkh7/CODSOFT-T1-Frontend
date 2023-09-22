
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const toggleBtn = document.querySelector('.toggle-btn');

    if (sidebar.style.display === 'none' || sidebar.style.display === '') {
        sidebar.style.display = 'block';
        content.style.marginLeft = '262px';
        toggleBtn.innerText = 'Close Sidebar';

    } else {
        sidebar.style.display = 'none';
        content.style.marginLeft = '0';
        toggleBtn.innerText = 'Open Sidebar';
    }
}

async function checkAuthentication() {
    const token = localStorage.getItem("auth-token");
    if (!token) {
        window.location.href = "access-denied.html";
        return;
    }
    console.log("Token exists:", token);

    function logout() {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("user-id");
        window.location.href = "../../index.html";
    }

    document.getElementById("logout-btn").addEventListener("click", logout);
}


// Run the authentication check when the page loads
window.onload = checkAuthentication;


document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM is fully loaded");
    try {
        // Retrieve the user ID from local storage
        const userId = localStorage.getItem("user-id");

        // Get the authentication token from localStorage
        const authToken = localStorage.getItem("auth-token");
        const blogList = document.getElementById("blog-list");

        const response = await fetch(`https://blog-backend-6b5y.onrender.com/blog`, {
            headers: {
                Authorization: authToken,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch blogs");
        }

        const data = await response.json();

        if (data.success && data.data.length > 0) {
            for (const blog of data.data) {
                    // Create a container div for each blog entry with a "card" class
                    const blogEntry = document.createElement("div");
                    blogEntry.classList.add("card"); // Add the "card" class

                    // Create elements for each blog entry
                    const blogTitle = document.createElement("h2");
                    const blogDescription = document.createElement("p");
                    const blogImage = document.createElement("img");
                    const commentsSection = document.createElement("div");
                    commentsSection.classList.add("comments-section");

                    // Set content and attributes for each element
                    blogTitle.textContent = blog.title;
                    blogDescription.textContent = blog.description;
                    blogImage.src = `https://blog-backend-6b5y.onrender.com/${blog.image}`;

                    // Append the elements to the blog entry container
                    blogEntry.appendChild(blogImage);
                    blogEntry.appendChild(blogTitle);
                    blogEntry.appendChild(blogDescription);
                    blogEntry.appendChild(commentsSection);

                    // Fetch comments for the specific blog post
                    const commentsResponse = await fetch(`https://blog-backend-6b5y.onrender.com/comment`, {
                        headers: {
                            Authorization: authToken,
                        },
                    });

                    if (commentsResponse.ok) {
                        const commentsData = await commentsResponse.json();
                        console.log("dataaaaaaaaa", commentsData.data)
                        // Display the fetched comments in the comments section
                        if (commentsData && commentsData.data.length > 0) {
                            commentsData.data.forEach((comment) => {
                                console.log("commm", comment.idBlog._id)
                                console.log("equall", blog._id)
                                let eqaulComment = comment.idBlog._id == blog._id
                                console.log("equalloo", eqaulComment)
                                if (eqaulComment) {
                                    const commentElement = document.createElement("div");
                                    commentElement.classList.add("comment");
                                    commentElement.textContent = comment.comment;
                                    commentsSection.appendChild(commentElement);
                                }
                            });
                        } else {
                            commentsSection.textContent = "No comments found.";
                        }
                    } else {
                        commentsSection.textContent = "Failed to fetch comments.";
                    }

                    // Append the blog entry to the container
                    blogList.appendChild(blogEntry);
            }
        }

    } catch (error) {
        alert("Something wrong!")
        console.error("Error:", error);
    }
});
