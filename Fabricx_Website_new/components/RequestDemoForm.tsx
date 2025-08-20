"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Country, isValidPhoneNumber } from "react-phone-number-input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import { PhoneInput } from "./ui/phone-input";
import { useEffect, useState } from "react";
import { Button } from "flowbite-react";

const requestDemoSchema = z.object({
    name: z.string().min(3).max(50),
    email: z.email("Please enter a valid email address"),
    company: z.string().min(1).max(50),
    phone: z
        .string()
        .refine(isValidPhoneNumber, { message: "Invalid phone number" })
        .or(z.literal("")),
    engagement_type: z.enum(["social-media", "friends", "email"]).optional(),
    message: z.string().min(3).max(500),
})

type RequestDemoSchemaType = z.infer<typeof requestDemoSchema>

const RequestDemoForm: React.FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = ({ className }) => {
    const form = useForm<RequestDemoSchemaType>({
        resolver: zodResolver(requestDemoSchema),
        defaultValues: {
            name: "",
            email: "",
            company: "",
            phone: "",
            engagement_type: undefined,
            message: "",
        },
    })

    const [countryCode, setCountryCode] = useState('');

    useEffect(() => {
        fetch('https://ipwho.is/')
            .then(res => res.json())
            .then(data => {
                setCountryCode(data.country_code);
            })
            .catch(err => console.error('Failed to get country code', err));
    }, []);

    function onSubmit(payload: RequestDemoSchemaType) {
        console.log(payload)
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-2", className)}>
                <div className="flex flex-col gap-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Full Name*" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>

                                <FormControl>
                                    <Input placeholder="Business Email*" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                            <FormItem>

                                <FormControl>
                                    <Input placeholder="Company*" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-start">
                                <FormControl className="w-full">
                                    <PhoneInput defaultCountry={countryCode as Country} placeholder="Mobile*" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="engagement_type"
                        render={({ field }) => (
                            <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl className="w-full">
                                        <SelectTrigger>
                                            <SelectValue placeholder="How did you hear about us?" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="social-media">Social Media</SelectItem>
                                        <SelectItem value="friends">Friends</SelectItem>
                                        <SelectItem value="email">Email Adverts</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea className="h-36" placeholder="How can we help you?" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex items-center justify-center mt-4">

                    <div>
                        <Button type="submit" className="">
                            Get a Demo
                        </Button>
                    </div>

                </div>
            </form>
        </Form>
    )
}

export default RequestDemoForm;