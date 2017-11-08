<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Cart v0.01</title>

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">

</head>
<body style="padding-top: 70px;">
<div id="app">
    @include('layouts.nav')
    @include('layouts.categories')
    @include('layouts.modal')
    <div class="container">
        <div class="row">
            <div class="col-lg-2">
                @yield('left-column')
            </div>
            <div class="col-lg-10">
                @yield('content')
            </div>
        </div>
    </div>

    <hr/>
    <footer class="footer" style="background-color: #eeeeee">
        <p class="text-center">Created by Uladzimir Sadkou hofirma@gmail.com</p>
    </footer>
</div>
<!-- Scripts -->
<script src="{{ asset('js/app.js') }}"></script>
<script src="{{asset('js/my_script.js')}}"></script>

</body>
</html>