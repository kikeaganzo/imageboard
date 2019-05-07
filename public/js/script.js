// Vue code

(function() {
    Vue.component("image-modal", {
        props: ["currentImage"],
        template: "#template",
        data: function() {
            return {
                img: "",
                clickImage: {},
                comments: [],
                form: {
                    comment: "",
                    username: ""
                }
            };
        },
        mounted: function() {
            console.log("Mounted works");
            var self = this;
            console.log("this ", this);
            axios.get(`/big-image/${this.currentImage}`).then(function(res) {
                console.log("res: ", res);

                self.clickImage = res.data[0];
            });


            axios.get(`/show-comments/${this.currentImage}`).then(function(res) {
                console.log("show comments axios Working?: ", res);
                self.comments = res.data.rows.reverse();
            });

        },
        methods: {
            addComment: function (e) {
                console.log("Add comment method working");
                e.preventDefault();
                let self = this;
                axios.post("/addComment", {
                    usercomment: self.form.usercomment,
                    username: self.form.username,
                    id: self.currentImage
                })
                    .then(function(results) {
                        console.log("results.data.rows[0]: ", results.data.rows[0]);
                        self.comments.unshift(results.data.rows[0]);
                        console.log("results.data[0]", results.data[0]);
                    });
            }
        }

    },


    new Vue({
        el: '#main',

        data: {
            images: [], //upload
            currentImage: null,
            form: {
                title: "",
                username: "",
                description: "",
                file: null
            }
        },

        // data ends

        mounted: function() {
            // then function runs once we've received response from server
            var self = this;
            axios.get('/get-images').then(function(resp) {
                self.images = resp.data;
            }).catch(function(err) {
                console.log("err: ", err);
            });
        },

        methods: {
            handleFileChange: function(e) {
                console.log("data from e ", e);
                this.form.file = e.target.files[0];
            },
            open: function(image_id) {
                console.log("Id of the image: ", image_id); //set the Id
                this.currentImage = image_id;
            },
            close: function() { // Set the ID to null and dissapear
                this.currentImage = null;
            },

            uploadFile: function(e) {
                e.preventDefault();
                var formData = new FormData();
                var self = this;
                formData.append("file", this.form.file);
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);

                axios.post("/upload", formData).then(data => {
                    self.images.unshift(data.data[0]); // Post images
                });
            }

        }
    }));

})();
