@extends('admin.admin')

@section('left-column')
    <div class="row">
        <div><a href="{{ route('admin.categories') }}">Categories</a></div>
        <div><a href="{{ route('admin.products') }}">Products</a></div>
        <div><a href="{{ route('admin.users') }}">Users</a></div>
        <div>Orders</div>
        <div>Payment</div>
        <div>Shipping</div>
        <div>Settings</div>
    </div>

@stop