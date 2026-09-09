// =========================
// DOM Elements
// =========================

let searchBtn = document.getElementById("searchBtn"); // زر البحث
let searchBox = document.getElementById("searchBox"); // Input البحث
let productContainer = document.getElementById("productContainer"); // Container المنتجات
let productsList = document.getElementById("productsList"); // قائمة المنتجات
let cart = document.getElementById("cart"); // Container الكارت
let cartList = document.getElementById("cartList"); // قائمة منتجات الكارت
let totalPrice = document.getElementById("totalPrice"); // مكان عرض السعر الكلي
let categoryFilter = document.getElementById("categoryFilter"); // Dropdown الفئات


// =========================
// Variables
// =========================

let cartProducts = []; // Array لتخزين المنتجات الموجودة في الكارت


// =========================
// Home Page
// =========================

async function homePage() { // Function مسؤولة عن تشغيل الصفحة

    productsList.textContent = "Loading..."; // إظهار Loading أثناء تحميل المنتجات

    try { // محاولة تنفيذ كود الـAPI

        let data = await getProducts();
        // =========================
        // Categories
        // =========================

        let categories = [...new Set(data.map((product) => {
            return product.category; // استخراج category من كل Product
        }))];


        categories.forEach((category) => { // المرور على كل Category

            let option = document.createElement("option"); // إنشاء option جديد

            option.textContent = category; // كتابة اسم الـCategory
            option.value = category; // وضع الـCategory كـvalue

            categoryFilter.appendChild(option); // إضافة الـoption للـselect
        });


        // =========================
        // Product Function
        // =========================

        function items(product) { // Function مسؤولة عن عرض Product

            let productItem = document.createElement("li"); // إنشاء Card للمنتج

            let img = document.createElement("img"); // إنشاء صورة
            img.setAttribute("src", product.image); // وضع صورة المنتج

            let title = document.createElement("h3"); // إنشاء عنوان
            title.textContent = product.title; // وضع اسم المنتج

            let price = document.createElement("P"); // إنشاء عنصر للسعر
            price.textContent = product.price + "$"; // وضع سعر المنتج

            let addBtn = document.createElement("button"); // إنشاء زر Add To Cart
            addBtn.textContent = "Add To Cart"; // كتابة اسم الزر


            // إضافة عناصر المنتج للصفحة
            productsList.appendChild(productItem); // إضافة Card للقائمة
            productItem.appendChild(img); // إضافة الصورة للكارت
            productItem.appendChild(title); // إضافة الاسم للكارت
            productItem.appendChild(price); // إضافة السعر للكارت
            productItem.appendChild(addBtn); // إضافة الزر للكارت


            // =========================
            // Add To Cart
            // =========================

            addBtn.addEventListener("click", () => { // تشغيل الكود عند الضغط على Add

                let result = cartProducts.find((item) => {
                    return item.id === product.id; // البحث هل المنتج موجود بالفعل في الكارت
                });

                let cartItem = document.createElement("li"); // إنشاء عنصر للمنتج داخل الكارت


                if (result === undefined) { // لو المنتج مش موجود في الكارت

                    cartProducts.push(product); // إضافة المنتج للـCart Array


                    // إنشاء بيانات المنتج داخل الكارت
                    let img = document.createElement("img"); // إنشاء صورة
                    img.setAttribute("src", product.image); // وضع صورة المنتج

                    let title = document.createElement("h3"); // إنشاء عنوان
                    title.textContent = product.title; // وضع اسم المنتج

                    let price = document.createElement("P"); // إنشاء السعر
                    price.textContent = product.price + "$"; // وضع سعر المنتج

                    let quantity = document.createElement("b"); // إنشاء عنصر للـQuantity
                    quantity.textContent = 1; // بداية الكمية بـ 1

                    product.quantity = 1; // تخزين كمية المنتج


                    cartList.appendChild(cartItem); // إضافة المنتج للكارت
                    product.cartItem = cartItem; // تخزين عنصر المنتج في الـDOM


                    let deleteBtn = document.createElement("button"); // إنشاء زر Delete
                    deleteBtn.textContent = "Delete"; // كتابة Delete


                    // إضافة عناصر المنتج للكارت
                    cartItem.appendChild(img); // إضافة الصورة
                    cartItem.appendChild(title); // إضافة الاسم
                    cartItem.appendChild(price); // إضافة السعر
                    cartItem.appendChild(quantity); // إضافة الكمية
                    cartItem.appendChild(deleteBtn); // إضافة زر Delete


                    // =========================
                    // Delete Product
                    // =========================

                    deleteBtn.addEventListener("click", () => { // تشغيل Delete عند الضغط

                        let index = cartProducts.findIndex((item) => {
                            return item.id === product.id; // إيجاد مكان المنتج في Array
                        });

                        cartProducts.splice(index, 1); // حذف المنتج من Array
                        cartItem.remove(); // حذف المنتج من الصفحة


                        let total = cartProducts.reduce((sum, item) => {
                            return sum + (item.price * item.quantity); // حساب إجمالي الأسعار
                        }, 0);

                        totalPrice.textContent = total; // عرض الإجمالي الجديد
                    });


                } else { // لو المنتج موجود بالفعل

                    result.quantity = result.quantity + 1; // زيادة الكمية 1

                    result.cartItem.querySelector("b").textContent =
                        result.quantity; // تحديث الكمية على الصفحة
                }


                // =========================
                // Calculate Total
                // =========================

                let total = cartProducts.reduce((sum, item) => {
                    return sum + (item.price * item.quantity); // السعر × الكمية
                }, 0);

                totalPrice.textContent = total; // عرض السعر الكلي
            });
        }


        // =========================
        // Display All Products
        // =========================

        data.forEach((product) => { // المرور على كل المنتجات
            items(product); // عرض كل Product
        });


        // =========================
        // Search
        // =========================

        searchBtn.addEventListener("click", () => { // تشغيل البحث عند الضغط

            let searchValue = searchBox.value.trim(); // أخذ قيمة البحث وإزالة المسافات

            let filteredProducts = data.filter((product) => { // فلترة المنتجات

                return product.title
                    .toLowerCase() // تحويل الاسم إلى lowercase
                    .includes(searchValue.toLowerCase()); // البحث عن الكلمة
            });


            productsList.innerHTML = ""; // مسح المنتجات القديمة


            filteredProducts.forEach((product) => { // المرور على نتائج البحث
                items(product); // عرض المنتجات المطابقة
            });
        });


        // =========================
        // Category Filter
        // =========================

        categoryFilter.addEventListener("change", () => { // تشغيل الفلتر عند تغيير الـCategory

            let selectedCategory = categoryFilter.value; // معرفة الـCategory المختارة

            let filteredProducts = data.filter((product) => { // فلترة المنتجات

                return selectedCategory === "all" ||
                    product.category === selectedCategory; // اختيار المنتجات المناسبة
            });


            productsList.innerHTML = ""; // مسح المنتجات القديمة


            filteredProducts.forEach((product) => { // المرور على المنتجات المطابقة
                items(product); // عرض المنتجات
            });
        });

    } catch (error) { // التعامل مع أي Error يحصل في الـAPI

        productsList.textContent = "Something went wrong ❌"; // عرض رسالة الخطأ

        console.log(error); // عرض تفاصيل الخطأ في Console
    }
}


// تشغيل الـHome Page
homePage(); // استدعاء الـFunction