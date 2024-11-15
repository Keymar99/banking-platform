"use client"

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomInput from './CustomInput'
import { authFormSchema } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/actions/user.actions';

const AuthForm = ({ type }: { type: string }) => {

    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    //const user = await getLoggedInUser();

    const formSchema = authFormSchema('sign-up');

    // 1. Define form validation.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    // 2. Define a submit handler.
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            if (type === 'sign-up') {
                const newUser = await signUp(data);
                setUser(newUser)
            }
            if (type === 'sign-in') {
                const response = await signIn({
                    email: data.email,
                    password: data.password,
                })
                if (response) router.push('/')
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className="auth-form">
            <header className="flex flex-col gap-5 md:gap-8">
                <Link href="/" className="cursor-pointer flex items-center gap-1">
                    <Image
                        src="/icons/logo1.svg"
                        width={34}
                        height={34}
                        alt="Horizon logo"
                    />
                    <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">Horizon</h1>
                </Link>
                <div className="flex flex-col gap-1 md:gap-3">
                    <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
                        {user ? 'Link Account' : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                        <p className="text-16 font-normal text-gray-600">
                            {user ? 'Link account to get started' : 'Please enter your details'}
                        </p>
                    </h1>
                </div>
            </header>
            {user ? (
                <div className="flex flex-col gap-4">{/*PlaidLink */}</div>
            ) : (
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {type === 'sign-up' && (
                                <>
                                    <div className="flex gap-4">
                                        <CustomInput control={form.control} name="firstName" label="First Name" placeholder="Enter your first name" />
                                        <CustomInput control={form.control} name="lastName" label="Last Name" placeholder="Enter your last name" />
                                    </div>
                                    <CustomInput control={form.control} name="address1" label="Address" placeholder="Enter your specific address" />
                                    <CustomInput control={form.control} name="city" label="City" placeholder="Enter your city" />
                                    <div className="flex gap-4">
                                        <CustomInput control={form.control} name="state" label="State" placeholder="eg: KL" />
                                        <CustomInput control={form.control} name="postalCode" label="Postal Code" placeholder="eg: 15400" />
                                    </div>
                                    <div className="flex gap-4">
                                        <CustomInput control={form.control} name="dateOfBirth" label="Date of Birth" placeholder="dd-mm-yyyy" />
                                        <CustomInput control={form.control} name="ssn" label="SSN" placeholder="eg: 1234" />
                                    </div>
                                </>
                            )}
                            {/* <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <div>
                                        <FormLabel className="form-label">
                                            Email
                                        </FormLabel>
                                        <div className="flex w-full flex-col">
                                            <FormControl>
                                                <Input
                                                    placeholder="Insert email"
                                                    className="input-class"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="form-message mt-2" />
                                        </div>
                                    </div>
                                )}
                            /> */

                            }
                            <CustomInput control={form.control} name="email" label="Email" placeholder="Enter your email" />
                            <CustomInput control={form.control} name="password" label="Password" placeholder="Enter your password" />


                            {/* <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <div>
                                        <FormLabel className="form-label">
                                            Password
                                        </FormLabel>
                                        <div className="flex w-full flex-col">
                                            <FormControl>
                                                <Input
                                                    placeholder="Please enter password"
                                                    className="input-class"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="form-message"
                                                type="password" />
                                        </div>
                                    </div>
                                )}
                            /> */}
                            <div className="flex flex-col gap-4">
                                <Button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" /> &nbsp;
                                            Loading...
                                        </>
                                    ) : type === 'sign-in'
                                        ? 'Sign In' : 'Sign Up'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <footer className="flex justify-center gap-1">
                        <p className="text-14 font-normal text-gray-600">
                            {type === 'sign-in' ?
                                "Create an account?" : "Already have an account?"}
                        </p>
                        <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className="form-link">
                            {type === 'sign-in' ? 'Sign up' : 'Sign in'}
                        </Link>
                    </footer>
                </>
            )}
        </section>
    )
}

export default AuthForm