      let customerDetails = {
        name: "Kevin",
        review:
          "Very good! restaurant, the food was very fresh and taty, the hospitality was great ,",
      };
      // console.log(customerDetails.review.length);
      function printReview(objName) {
        const formattedName = objName.name.toUpperCase();
        const formatedComment = objName.review.slice(0, 20);
        console.log(
          `Thankyou ${formattedName} , your comment:${formatedComment}`,
        );
      }
      printReview(customerDetails);