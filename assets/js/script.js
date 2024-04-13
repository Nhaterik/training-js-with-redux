
function validator(options){
    function getParent(element,selector) {
        while(element.parentElement)
        {
            if(element.parentElement.matches(selector))
            return element.parentElement
            element=element.parentElement
        }
        
    }
    const selectorRules={}
    function validate(inputElement,rule) {
        // const errorElement=inputElement.parentElement.querySelector(options.errorSelector)
        const errorElement=getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector)
        var errorMes
        // =rule.test(inputElement.value)
        // take each rule of selector
        const rules=selectorRules[rule.selector]
        // check each rule in that selector
        for(var i=0;i<rules.length;i++){
            switch(inputElement.type) {
                case 'radio':
                case 'checkbox':
                errorMes=rules[i](formElement.querySelector(rule.selector+':checked'))
                    break;
                default:
                errorMes=rules[i](inputElement.value)
            }
            if(errorMes) break;
        }
        
       if(errorMes)
       {
        errorElement.innerText=errorMes
        getParent(inputElement,options.formGroupSelector).classList.add('invalid')
       }
       else {
        errorElement.innerText=''
        getParent(inputElement,options.formGroupSelector).classList.remove('invalid')

       }
       // THINK about error undefined will remove invalid so - >true
       return !errorMes
    }
 const formElement=document.querySelector(options.form)
 if(formElement)
 {
    formElement.onsubmit=function(e){
        // removed reload the page
        e.preventDefault();
        var isFormValid=true
        options.rules.forEach(rule=>{
            const inputElement=formElement.querySelector(rule.selector)
            var isValid=validate(inputElement,rule)
            if(!isValid) {
               isFormValid=false
            } 
        })
        if(isFormValid) {
            if(typeof options.onSubmit==='function') {
            var enableInput=formElement.querySelectorAll('[name]:not([disabled])')
            var formValues=Array.from(enableInput).reduce( (values,input) => {
                switch(input.type)
                {
                    case 'radio':
                        values[input.name]=formElement.querySelector('input[name="'+input.name+'"]:checked').value
                        break;
                    case 'checkbox':
                        if(!input.matches(':checked')){
                            // values[input.name]='';
                            return values
                        }
                        if(!Array.isArray(values[input.name]) ){
                            values[input.name]=[]
                        }
                        values[input.name].push(input.value);
                        break;
                    default:
                        values[input.name]=input.value
                }
                return  values } ,{})

                options.onSubmit(formValues)
            }
        }
      

        
    }
    options.rules.forEach(rule => {
        if(Array.isArray(selectorRules[rule.selector])){
            selectorRules[rule.selector].push(rule.test)
        } else {
            selectorRules[rule.selector]=[rule.test]
        }
        // const inputElement=formElement.querySelector(rule.selector)
        const inputElements=formElement.querySelectorAll(rule.selector)
        Array.from(inputElements).forEach(inputElement=>{
            
            if(inputElement)    
            {
                inputElement.onblur=function(){
                    validate(inputElement,rule)
                }
                inputElement.oninput=function(){
             const errorElement=getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector)
                    errorElement.innerText=''
                    getParent(inputElement,options.formGroupSelector).classList.remove('invalid')
                }
            }

        })
    });
 }
}
validator.isRequired=function(selector){
    return {
        selector:selector,
        test:function(value) {
            // return value.trim() ? undefined : 'Vui long nhap truong nay'
            return value ? undefined : 'Vui long nhap truong nay'
        }
    }

}
validator.isEmail=function(selector){
    return {
        selector:selector,
        test:function(value) {
            var rgx=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return rgx.test(value) ? undefined : "vui long nhap email lai"
        }
    }

}
validator.isMinLength=function(selector,min){
    return {
        selector:selector,
        test:function(value) {
            return value.length>= min ? undefined : `vui long nhap toi thieu ${min} ky tu `
        }
    }

}
validator.isConfirmed=function(selector,getCofirmValue) {
    return {
        selector:selector,
        test:function(value){
            return value===getCofirmValue() ? undefined : 'Ban nhap sai mat khau'
        }
    }
}
validator({
    form:'#form-1',
    formGroupSelector:'.form-group',
    errorSelector:'.form-mes',
    rules:[
        // validator.isRequired('#fullname',"Vui long nhap dau du ten cua ban nhe"),
        // validator.isRequired('#email'),
        // validator.isEmail('#email'),
        // validator.isMinLength('#password',6),
        // validator.isRequired('#password-confirmation'),
        validator.isRequired('input[name="gender"]'),
        // validator.isConfirmed('#password-confirmation',()=>{
        //     return document.querySelector('#form-1 #password').value;
        // }),
    ],
    onSubmit: function(data) {
        console.log(data)
    },
})